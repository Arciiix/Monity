import { ApiProperty } from "@nestjs/swagger";

class UpdateAvatarReturnDto {
  @ApiProperty({
    type: String,
    description: "Updated avatar URI",
  })
  avatarURI: string;
}

export { UpdateAvatarReturnDto };
