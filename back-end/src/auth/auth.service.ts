import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as argon2 from "argon2";
import { Response } from "express";
import { Timestamp } from "src/global.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  JWTPayload,
  Tokens,
  UserJWTReturnDto,
  UserLoginDto,
  UserRegisterDto,
  UserReturnDto,
} from "./dto/user.dto";
import { TwoFaService } from "./twoFa.service";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private logger: Logger,
    private jwt: JwtService,
    private config: ConfigService,
    private twoFaService: TwoFaService
  ) {}

  async register(
    user: UserRegisterDto,
    res: Response
  ): Promise<UserJWTReturnDto> {
    //Check if the user already exists
    const userExists = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: user.login }, { email: user.email }],
      },
    });

    if (userExists) {
      this.logger.log(
        `Tried to register user ${user.login} but they already exist`,
        "Auth"
      );
      throw new ConflictException(`User already exists`);
    }

    const passwordHash = await argon2.hash(user.password);

    const createdUser = await this.prismaService.user.create({
      data: {
        login: user.login,
        email: user.email,
        password: passwordHash,
      },
    });

    const tokens = await this.generateTokens(createdUser, res);

    this.logger.log(`A new user ${createdUser.login} has been created`, "Auth");
    return {
      id: createdUser.id,
      email: createdUser.email,
      login: createdUser.login,
      tokens,
    };
  }

  async login(user: UserLoginDto, res: Response): Promise<UserJWTReturnDto> {
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: user.login }, { email: user.login }],
      },
    });

    if (!foundUser) {
      this.logger.log(
        `Tried to login user ${user.login} but they don't exist`,
        "Auth"
      );
      throw new NotFoundException(`User doesn't exist`);
    }

    const isPasswordValid = await argon2.verify(
      foundUser.password,
      user.password
    );

    if (!isPasswordValid) {
      this.logger.log(
        `Tried to login user ${user.login} but the password is incorrect`,
        "Auth"
      );
      throw new ForbiddenException(`Password is incorrect`);
    }

    if (foundUser.twoFaSecret) {
      if (!user.twoFaCode) {
        this.logger.log(
          `Tried to login user ${user.login} but didn't provide 2FA code`,
          "Auth"
        );
        throw new UnauthorizedException("Missing 2FA code");
      } else {
        await this.authorizeWith2FA(foundUser, user.twoFaCode);
      }
    }

    const tokens = await this.generateTokens(foundUser, res);

    this.logger.log(`User ${user.login} has logged in`, "Auth");

    return {
      id: foundUser.id,
      email: foundUser.email,
      login: foundUser.login,
      tokens,
    };
  }

  async generateTokens(user: User, res: Response): Promise<Tokens> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    this.logger.log(`Generated new tokens for ${user.login}`, "Auth");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: this.config.get("JWT_ACCESS_TOKEN_EXPIRES_IN") * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: this.config.get("JWT_REFRESH_TOKEN_EXPIRES_IN") * 1000,
      path: `/${this.config.get("API_VERSION")}/auth`,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    const userObj: JWTPayload = {
      id: user.id,
      email: user.email,
      login: user.login,
    };
    return this.jwt.sign(userObj, {
      secret: this.config.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_TOKEN_EXPIRES_IN"),
    });
  }

  async generateRefreshToken(user: User): Promise<string> {
    //If user has exceeded the number of refresh tokens allowed, delete the oldest one
    const userRefreshTokens = await this.prismaService.refreshToken.count({
      where: {
        userId: user.id,
      },
    });

    if (userRefreshTokens >= this.config.get("MAX_REFRESH_TOKENS_PER_USER")) {
      const oldestRefreshToken =
        await this.prismaService.refreshToken.findFirst({
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      this.logger.log(
        `Maxiumum token amount exceeded for user ${user.login}; deleting oldest token`,
        "Auth"
      );

      await this.prismaService.refreshToken.delete({
        where: {
          id: oldestRefreshToken.id,
        },
      });
    }

    const userObj: JWTPayload = {
      id: user.id,
      email: user.email,
      login: user.login,
    };

    const token = this.jwt.sign(userObj, {
      secret: this.config.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.config.get("JWT_REFRESH_TOKEN_EXPIRES_IN"),
    });

    //Save the token to the database
    await this.prismaService.refreshToken.create({
      data: {
        token: await argon2.hash(token),
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    this.logger.log(`Generated refresh token`, "Auth");

    return token;
  }

  async logout(refreshToken: string, userId: string): Promise<Timestamp> {
    if (refreshToken) {
      const userTokens = await this.prismaService.refreshToken.findMany({
        where: {
          userId,
        },
      });

      for await (const token of userTokens) {
        if (await argon2.verify(token.token, refreshToken)) {
          await this.prismaService.refreshToken.deleteMany({
            where: {
              token: token.token,
              userId: token.userId,
            },
          });
          break;
        }
      }
    }

    this.logger.log(`User ${userId} has logged out`, "Auth");

    return {
      timestamp: new Date(),
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      this.logger.log(
        `Tried to get user by id ${id} but they don't exist`,
        "Auth"
      );
      throw new NotFoundException(`User doesn't exist`);
    }

    return user;
  }

  async decodeJWTToken(token: string): Promise<JWTPayload> {
    const tokenData: JWTPayload = this.jwt.decode(token) as JWTPayload;
    return tokenData;
  }

  async refreshToken(refreshToken: string, res: Response): Promise<Tokens> {
    const tokenPayload = await this.decodeJWTToken(refreshToken);
    const user = await this.getUserById(tokenPayload.id);

    //Check if the user has that refresh token
    const userRefreshTokens = await this.prismaService.refreshToken.findMany({
      where: {
        userId: user.id,
      },
    });

    let isRefreshTokenFound = false;
    for await (const token of userRefreshTokens) {
      if (await argon2.verify(token.token, refreshToken)) {
        isRefreshTokenFound = true;
        break;
      }
    }
    if (!isRefreshTokenFound) {
      throw new UnauthorizedException("User is not authenticated");
    }

    return await this.generateTokens(user, res);
  }

  async authorizeWith2FA(user: User, code: string): Promise<UserReturnDto> {
    //Check if the user has enabled 2FA
    if (!user.twoFaSecret) {
      this.logger.log(
        `Tried to authenticate user ${user.login} but the user has not enabled 2FA`,
        "Auth [2FA]"
      );
      throw new ConflictException("2FA is not enabled");
    }

    //Check if the code is correct
    const isValid: boolean = await this.twoFaService.validate2FACode(
      user,
      code
    );

    if (!isValid) {
      this.logger.log(
        `Tried to authenticate user ${user.login} but the code is invalid`,
        "Auth [2FA]"
      );
      throw new UnauthorizedException("2FA code is incorrect");
    }

    //Return the tokens
    return {
      id: user.id,
      email: user.email,
      login: user.login,
    };
  }
}
