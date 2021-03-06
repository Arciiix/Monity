interface IUser {
  id: string;
  email: string;
  login: string;
  avatarURI: string;
}

interface IUserLoginDto {
  login: string;
  password: string;
  twoFaCode?: string;
}
interface IUserRegisterDto {
  email: string;
  login: string;
  password: string;
}

export type { IUser, IUserLoginDto, IUserRegisterDto };
