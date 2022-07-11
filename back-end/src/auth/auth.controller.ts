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
import { Response } from "express";
import { RequestWithUser, Timestamp } from "src/global.dto";
import { Auth } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { TwoFaDto, TwoFaStatus } from "./dto/twoFa.dto";

import {
  Tokens,
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
    @Body() user: UserRegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserJWTReturnDto> {
    return await this.authService.register(user, res);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({
    description: "The user has been successfully logged in",
    type: UserJWTReturnDto,
  })
  @ApiForbiddenResponse({ description: "The password is incorrect" })
  @ApiNotFoundResponse({ description: "The user does not exist" })
  @ApiUnauthorizedResponse({
    description: "Two factor authentication code required",
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() user: UserLoginDto
  ): Promise<UserJWTReturnDto> {
    return await this.authService.login(user, res);
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
    @Req() req: RequestWithUser,
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
    description: "User is unauthorized",
  })
  @ApiOperation({
    summary: "Get a new access token from the refresh token",
  })
  async refreshToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): Promise<Tokens> {
    const refreshToken =
      req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      throw new BadRequestException("Missing refresh token or user not logged");
    }

    //Get tokens
    return await this.authService.refreshToken(refreshToken, res);
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
  async twoFaStatus(@Req() req: RequestWithUser): Promise<TwoFaStatus> {
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
    @Req() req: RequestWithUser,
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
  @ApiOperation({
    summary: "Get the QR code for 2FA",
  })
  @Auth()
  async getTwoFaQrCode(@Req() req: RequestWithUser, @Res() res: Response) {
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
