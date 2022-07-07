import { Controller, Get, Put, Req } from "@nestjs/common";
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Auth } from "src/auth/auth.decorator";
import { UserReturnDto } from "src/auth/dto/user.dto";
import { RequestWithUser } from "src/global.dto";
import { UpdateAvatarReturnDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
@Auth()
@ApiTags("user")
@ApiForbiddenResponse({
  description: "User isn't authenticated",
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  @ApiOkResponse({
    description: "Get the current user data",
    type: UserReturnDto,
  })
  async me(@Req() req: RequestWithUser): Promise<UserReturnDto> {
    return {
      id: req.user.id,
      email: req.user.email,
      login: req.user.login,
      avatarURI: req.user.avatarURI,
    };
  }

  @ApiOkResponse({
    description: "Change the user avatar (regenerate it)",
    type: UpdateAvatarReturnDto,
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @Put("/avatar")
  async avatar(@Req() req: RequestWithUser): Promise<UpdateAvatarReturnDto> {
    return await this.userService.changeAvatarURI(req.user.id);
  }
}
