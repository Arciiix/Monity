import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

class UserRegisterDto {
  @ApiProperty({ type: String, description: "login", example: "john" })
  @Length(4, 20)
  @IsAlphanumeric()
  login: string;

  @ApiProperty({
    type: String,
    description: "email",
    example: "john@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: "password",
    example: "UltraStrongPassword123",
  })
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]+$/, {
    message:
      "password should contain at least one number, one lowercase and one uppercase letter, and only the following special characters: !@#$%^&*",
  })
  password: string;
}
class UserLoginDto {
  @ApiProperty({ type: String, description: "login", example: "john" })
  @IsString()
  login: string;

  @ApiProperty({
    type: String,
    description: "password",
    example: "UltraStrongPassword123",
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    description: "twoFaCode",
    example: "123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  twoFaCode: string;
}

class UserReturnDto {
  @ApiProperty({ type: String, description: "user id" })
  id: string;

  @ApiProperty({ type: String, description: "login" })
  login: string;

  @ApiProperty({ type: String, description: "email" })
  email: string;

  @ApiProperty({ type: String, description: "Avatar URL" })
  avatarURI: string;
}

class Tokens {
  @ApiProperty({ type: String, description: "access token" })
  accessToken: string;
  @ApiProperty({ type: String, description: "refresh token" })
  refreshToken: string;
}
class UserJWTReturnDto extends UserReturnDto {
  @ApiProperty({ type: Tokens, description: "jwt tokens" })
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

class JWTPayload {
  @ApiProperty({ type: String, description: "user id" })
  id: string;

  @ApiProperty({ type: String, description: "login" })
  login: string;

  @ApiProperty({ type: String, description: "email" })
  email: string;
}

export {
  UserRegisterDto,
  UserLoginDto,
  UserReturnDto,
  UserJWTReturnDto,
  Tokens,
  JWTPayload,
};
