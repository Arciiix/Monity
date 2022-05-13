interface IUser {
  id: string;
  email: string;
  login: string;
}

interface IUserLoginDto {
  login: string;
  password: string;
}
interface IUserRegisterDto {
  email: string;
  login: string;
  password: string;
}

export type { IUser, IUserLoginDto, IUserRegisterDto };
