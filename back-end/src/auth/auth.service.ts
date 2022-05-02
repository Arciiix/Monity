import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRegisterDto, UserReturnDto } from "./dto/user.dto";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(user: UserRegisterDto): Promise<UserReturnDto> {
    const passwordHash = await argon2.hash(user.password);

    const createdUser = await this.prismaService.user.create({
      data: {
        login: user.login,
        email: user.email,
        password: passwordHash,
      },
    });
    return {
      id: createdUser.id,
      email: createdUser.email,
      login: createdUser.login,
    };
  }
}
