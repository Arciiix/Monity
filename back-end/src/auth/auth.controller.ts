import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

import { UserRegisterDto, UserReturnDto } from "./dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() user: UserRegisterDto): Promise<UserReturnDto> {
    return await this.authService.register(user);
  }
}
