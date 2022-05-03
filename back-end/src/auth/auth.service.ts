import { ConflictException, Injectable, Logger } from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRegisterDto, UserReturnDto } from "./dto/user.dto";

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private logger: Logger) {}

  async register(user: UserRegisterDto): Promise<UserReturnDto> {
    //Check if the user already exists
    const userExists = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: user.login }, { email: user.email }],
      },
    });

    if (userExists) {
      this.logger.log(
        `Tried to register user ${user.login} but they already exist`,
        "Auth"
      );
      throw new ConflictException(`User already exists`);
    }

    const passwordHash = await argon2.hash(user.password);

    const createdUser = await this.prismaService.user.create({
      data: {
        login: user.login,
        email: user.email,
        password: passwordHash,
      },
    });
    this.logger.log(`A new user ${createdUser.login} has been created`, "Auth");
    return {
      id: createdUser.id,
      email: createdUser.email,
      login: createdUser.login,
    };
  }
}
