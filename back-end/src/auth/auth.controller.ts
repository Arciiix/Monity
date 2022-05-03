import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";

import { UserLoginDto, UserRegisterDto, UserReturnDto } from "./dto/user.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiCreatedResponse({
    description: "The user has been successfully registered",
    type: UserReturnDto,
  })
  @ApiConflictResponse({ description: "The user already exists" })
  @ApiBadRequestResponse({
    description: "Validation errors",
  })
  async register(@Body() user: UserRegisterDto): Promise<UserReturnDto> {
    return await this.authService.register(user);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({
    description: "The user has been successfully logged in",
    type: UserReturnDto,
  })
  @ApiForbiddenResponse({ description: "The password is incorrect" })
  @ApiNotFoundResponse({ description: "The user does not exist" })
  async login(@Body() user: UserLoginDto): Promise<UserReturnDto> {
    return await this.authService.login(user);
  }
}
