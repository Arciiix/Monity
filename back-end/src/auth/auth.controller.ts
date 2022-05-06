import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
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
  ApiOperation,
  ApiParam,
  ApiQuery,
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
import { TwoFaDto, TwoFaStatus } from "./dto/twoFa.dto";

import {
  UserJWTReturnDto,
  UserLoginDto,
  UserRegisterDto,
  UserReturnDto,
} from "./dto/user.dto";
import { TwoFaService } from "./twoFa.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private twoFaService: TwoFaService,
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
    type: Timestamp,
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

  @Post("authWithTwoFA/:code")
  @ApiOperation({
    description:
      "When user has 2FA enabled and tries to log in, they need to provide the code - this endpoint will check if the code is correct and generate new, authenticated tokens",
  })
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
  @ApiOperation({
    description: "Refresh the access token by using the refresh token",
  })
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

    const response = await this.authService.refreshToken(refreshToken);

    res.cookie("accessToken", response, {
      httpOnly: true,
      maxAge:
        (this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_IN") ||
          JWT_ACCESS_TOKEN_EXPIRES_IN) * 1000,
    });

    return response;
  }

  @Get("me")
  @ApiOkResponse({
    description: "Get the current user data",
    type: UserReturnDto,
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

  @Get("/twoFaStatus")
  @ApiOkResponse({
    description: "Get the current user 2FA status",
    type: TwoFaStatus,
  })
  @ApiUnauthorizedResponse({
    description: "User isn't authenticated",
  })
  @Auth()
  async twoFaStatus(@Req() req): Promise<TwoFaStatus> {
    return this.twoFaService.get2FAStatus(req.user);
  }

  @Post("toggleTwoFA/:isEnabled")
  @ApiParam({
    name: "isEnabled",
    description: "Toggle 2FA",
    type: Boolean,
  })
  @ApiQuery({
    name: "code",
    description: "Two factor authentication code (if toggling off)",
    required: false,
  })
  @ApiOkResponse({
    description: "Two factor authentication has been successfully toggled",
  })
  @ApiUnauthorizedResponse({
    description: "User isn't authenticated",
  })
  @ApiForbiddenResponse({
    description:
      "User wants to turn off 2FA but didn't provide or provided the wrong 2FA code",
  })
  @Auth()
  async toggle2FA(
    @Req() req: Request,
    @Param("isEnabled") isEnabled: boolean,
    @Query("code") code?: string
  ): Promise<(TwoFaDto & Timestamp) | Timestamp> {
    return await this.twoFaService.toggle2FA(req.user as User, isEnabled, code);
  }

  @Get("/twoFaQrCode")
  @ApiOkResponse({
    description: "Get the QR code for 2FA",
  })
  @ApiConflictResponse({
    description: "2FA not enabled",
  })
  @Auth()
  async getTwoFaQrCode(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;

    if (user.twoFaSecret) {
      return await this.twoFaService.pipeQrCodeStream(
        res,
        user.login,
        user.twoFaSecret
      );
    } else {
      throw new ConflictException("2FA is not enabled");
    }
  }
}
