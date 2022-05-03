import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";

import { UserRegisterDto, UserReturnDto } from "./dto/user.dto";

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
}
