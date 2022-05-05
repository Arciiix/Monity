import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as argon2 from "argon2";
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
  MAX_REFRESH_TOKENS_PER_USER,
} from "src/defaultConfig";
import { Timestamp } from "src/global.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  JWTPayload,
  UserJWTReturnDto,
  UserLoginDto,
  UserRegisterDto,
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

  async register(user: UserRegisterDto): Promise<UserJWTReturnDto> {
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

    const tokens = await this.generateTokens(createdUser, true);

    this.logger.log(`A new user ${createdUser.login} has been created`, "Auth");
    return {
      id: createdUser.id,
      email: createdUser.email,
      login: createdUser.login,
      tokens: {
        ...tokens,
        ...{ requiresTwoFaAuthentication: false },
      },
    };
  }

  async login(user: UserLoginDto): Promise<UserJWTReturnDto> {
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

    const tokens = await this.generateTokens(foundUser, !foundUser.twoFaSecret);

    this.logger.log(`User ${user.login} has logged in`, "Auth");

    return {
      id: foundUser.id,
      email: foundUser.email,
      login: foundUser.login,
      tokens: {
        ...tokens,
        ...{ requiresTwoFaAuthentication: !!foundUser.twoFaSecret },
      },
    };
  }

  async generateTokens(
    user: User,
    isAuthenticated?: boolean
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user, !isAuthenticated);

    let refreshToken;
    if (!!isAuthenticated) {
      refreshToken = await this.generateRefreshToken(user);
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(
    user: User,
    isTemporary?: boolean
  ): Promise<string> {
    const userObj: JWTPayload = {
      id: user.id,
      email: user.email,
      login: user.login,
      isAuthenticated: !isTemporary,
    };
    this.logger.log(
      `Generated ${isTemporary ? "temporary " : ""}access token`,
      "Auth"
    );
    return this.jwt.sign(userObj, {
      secret: this.config.get("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn:
        this.config.get("JWT_ACCESS_TOKEN_EXPIRES_IN") ||
        JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  async generateRefreshToken(user: User): Promise<string> {
    //If user has exceeded the number of refresh tokens allowed, delete the oldest one
    const userRefreshTokens = await this.prismaService.refreshToken.count({
      where: {
        userId: user.id,
      },
    });

    if (
      userRefreshTokens >=
      (this.config.get("MAX_REFRESH_TOKENS_PER_USER") ||
        MAX_REFRESH_TOKENS_PER_USER)
    ) {
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
      isAuthenticated: true,
    };

    const token = this.jwt.sign(userObj, {
      secret: this.config.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn:
        this.config.get("JWT_REFRESH_TOKEN_EXPIRES_IN") ||
        JWT_REFRESH_TOKEN_EXPIRES_IN,
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
    const user = await this.prismaService.user.findFirst({
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

  async authorizeWith2FA(
    code: string,
    accessToken: string
  ): Promise<UserJWTReturnDto> {
    //Decode the JWT token
    const decoded = await this.decodeJWTToken(accessToken);

    //Check if the user has already been authenticated
    if (decoded.isAuthenticated) {
      this.logger.log(
        `Tried to authenticate user ${decoded.login} but they are already authenticated`,
        "Auth [2FA]"
      );
      throw new ConflictException("User has already been authenticated");
    }

    //Find the user
    const user = await this.getUserById(decoded.id);

    //Check if the user has enabled 2FA
    if (!user.twoFaSecret) {
      this.logger.log(
        `Tried to authenticate user ${decoded.login} but the user has not enabled 2FA`,
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
        `Tried to authenticate user ${decoded.login} but the code is invalid`,
        "Auth [2FA]"
      );
      throw new ForbiddenException("2FA code is incorrect");
    }

    //Generate new tokens
    const tokens = await this.generateTokens(user, true);

    //Return the tokens
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      tokens: {
        ...tokens,
        ...{ requiresTwoFaAuthentication: false },
      },
    };
  }
}
