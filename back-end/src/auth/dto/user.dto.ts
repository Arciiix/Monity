import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Length,
  Matches,
} from "class-validator";

class UserRegisterDto {
  @Length(4, 20)
  @IsAlphanumeric()
  login: string;

  @IsEmail()
  email: string;

  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]+$/, {
    message:
      "password should contain at least one number, one lowercase and one uppercase letter, and only the following special characters: !@#$%^&*",
  })
  password: string;
}
class UserLoginDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

class UserReturnDto {
  id: string;
  login: string;
  email: string;
}

export { UserRegisterDto, UserLoginDto, UserReturnDto };
