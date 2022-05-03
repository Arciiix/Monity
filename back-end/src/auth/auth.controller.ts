import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

import { UserRegisterDto, UserReturnDto } from "./dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: "The user has been successfully registered",
    type: UserReturnDto,
  })
  @ApiBadRequestResponse({
    description: "Validation errors",
  })
  @Post("register")
  async register(@Body() user: UserRegisterDto): Promise<UserReturnDto> {
    return await this.authService.register(user);
  }
}
