import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Length,
  Matches,
} from "class-validator";

class UserRegisterDto {
  @ApiProperty({ type: String, description: "login" })
  @Length(4, 20)
  @IsAlphanumeric()
  login: string;

  @ApiProperty({ type: String, description: "email" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: "password" })
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]+$/, {
    message:
      "password should contain at least one number, one lowercase and one uppercase letter, and only the following special characters: !@#$%^&*",
  })
  password: string;
}
class UserLoginDto {
  @ApiProperty({ type: String, description: "login" })
  @IsString()
  login: string;

  @ApiProperty({ type: String, description: "password" })
  @IsString()
  password: string;
}

class UserReturnDto {
  @ApiProperty({ type: String, description: "user id" })
  id: string;

  @ApiProperty({ type: String, description: "login" })
  login: string;

  @ApiProperty({ type: String, description: "email" })
  email: string;
}

export { UserRegisterDto, UserLoginDto, UserReturnDto };
