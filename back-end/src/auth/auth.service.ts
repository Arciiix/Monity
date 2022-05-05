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

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private logger: Logger,
    private jwt: JwtService,
    private config: ConfigService
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
    this.logger.log(`A new user ${createdUser.login} has been created`, "Auth");
    return {
      id: createdUser.id,
      email: createdUser.email,
      login: createdUser.login,
      tokens: {
        accessToken: "",
        refreshToken: "",
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

    //TODO: If user has 2FA enabled, send unauthenticated token
    const tokens = await this.generateTokens(foundUser);

    this.logger.log(`User ${user.login} has been logged in`, "Auth");

    return {
      id: foundUser.id,
      email: foundUser.email,
      login: foundUser.login,
      tokens,
    };
  }

  async generateTokens(
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
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
}
