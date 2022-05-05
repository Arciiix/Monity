import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from "src/defaultConfig";
import { Timestamp } from "src/global.dto";
import { Auth } from "./auth.decorator";
import { AuthService } from "./auth.service";

import {
  UserJWTReturnDto,
  UserLoginDto,
  UserRegisterDto,
  UserReturnDto,
} from "./dto/user.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Post("register")
  @ApiCreatedResponse({
    description: "The user has been successfully registered",
    type: UserJWTReturnDto,
  })
  @ApiConflictResponse({ description: "The user already exists" })
  @ApiBadRequestResponse({
    description: "Validation errors",
  })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() user: UserRegisterDto
  ): Promise<UserJWTReturnDto> {
    const response = await this.authService.register(user);
    res.cookie("accessToken", response.tokens.accessToken, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN") ||
          JWT_ACCESS_TOKEN_EXPIRES_IN) * 1000,
    });

    res.cookie("refreshToken", response.tokens.accessToken, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_REFRESH_TOKEN_EXPIRES_IN") ||
          JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000,
    });

    return response;
  }

  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({
    description: "The user has been successfully logged in",
    type: UserJWTReturnDto,
  })
  @ApiForbiddenResponse({ description: "The password is incorrect" })
  @ApiNotFoundResponse({ description: "The user does not exist" })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() user: UserLoginDto
  ): Promise<UserJWTReturnDto> {
    const response = await this.authService.login(user);

    res.cookie("accessToken", response.tokens.accessToken, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN") ||
          JWT_ACCESS_TOKEN_EXPIRES_IN) * 1000,
    });

    //TODO: Note that in 2FA, user will not always get the refrsh token
    if (response.tokens.refreshToken) {
      res.cookie("refreshToken", response.tokens.accessToken, {
        httpOnly: true,
        maxAge:
          (this.configService.get("JWT_REFRESH_TOKEN_EXPIRES_IN") ||
            JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000,
      });
    }

    return response;
  }

  @Delete("logout")
  @ApiOkResponse({
    description: "User has been successfully logged out",
  })
  @ApiForbiddenResponse({
    description: "User isn't authenticated",
  })
  @Auth()
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<Timestamp> {
    const refreshToken =
      req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    const userId = (req.user as User).id;
    if (refreshToken) {
      return await this.authService.logout(refreshToken, userId);
    } else {
      return {
        timestamp: new Date(),
      };
    }
  }

  @Post("authWith2FA/:code")
  @ApiParam({
    description: "Two factor authentication code",
    name: "code",
  })
  @ApiOkResponse({
    description: "User has been authenticated",
    type: UserJWTReturnDto,
  })
  @ApiUnauthorizedResponse({
    description: "User is unauthorized (is not logged in)",
  })
  @ApiConflictResponse({
    description: "2FA not enabled or user has been already authenticated",
  })
  @ApiNotFoundResponse({ description: "User doesn't exist" })
  @ApiForbiddenResponse({ description: "Wrong 2FA code" })
  async authWith2FA(
    @Req() req: Request,
    @Param("code") code: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserJWTReturnDto> {
    const accessToken =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      throw new UnauthorizedException("User is not logged in");
    }

    const response = await this.authService.authorizeWith2FA(code, accessToken);

    res.cookie("accessToken", response.tokens.accessToken, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN") ||
          JWT_ACCESS_TOKEN_EXPIRES_IN) * 1000,
    });

    res.cookie("refreshToken", response.tokens.accessToken, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_REFRESH_TOKEN_EXPIRES_IN") ||
          JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000,
    });

    return response;
  }

  @Post("refreshToken")
  @ApiOkResponse({
    description: "The access token has been successfully refreshed",
    type: UserJWTReturnDto,
  })
  @ApiBadRequestResponse({
    description: "Missing refresh token or user is not logged",
  })
  @ApiUnauthorizedResponse({
    description: "User is unauthenticated",
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserJWTReturnDto> {
    const refreshToken =
      req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      throw new BadRequestException("Missing refresh token or user not logged");
    }

    const tokenPayload = await this.authService.decodeJWTToken(refreshToken);
    if (!tokenPayload.isAuthenticated) {
      throw new UnauthorizedException("User is not authenticated");
    }

    const user = await this.authService.getUserById(tokenPayload.id);
    const response = await this.authService.generateAccessToken(
      user,
      !tokenPayload.isAuthenticated
    );

    res.cookie("accessToken", response, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN") ||
          JWT_ACCESS_TOKEN_EXPIRES_IN) * 1000,
    });

    return {
      tokens: {
        accessToken: response,
        refreshToken,
        requiresTwoFaAuthentication: false,
      },

      id: user.id,
      login: user.login,
      email: user.email,
    };
  }

  @Get("me")
  @ApiOkResponse({
    description: "Get the current user data",
  })
  @ApiForbiddenResponse({
    description: "User isn't authenticated",
  })
  @Auth()
  async me(@Req() req): Promise<UserReturnDto> {
    return {
      id: req.user.id,
      email: req.user.email,
      login: req.user.login,
    };
  }
}
