import { ApiProperty } from "@nestjs/swagger";
import { UserReturnDto } from "src/auth/dto/user.dto";

class UpdateAvatarReturnDto {
  @ApiProperty({
    type: String,
    description: "Updated avatar URI",
  })
  avatarURI: string;
}

export { UpdateAvatarReturnDto };
