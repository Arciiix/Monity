import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { UserLoginDto, UserRegisterDto, UserReturnDto } from "./dto/user.dto";

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

  async login(user: UserLoginDto): Promise<UserReturnDto> {
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ login: user.login }, { email: user.login }],
      },
    });

    if (!foundUser) {
      this.logger.log(
        `Tried to login user ${user.login} but they don't exist`,
        "Auth"
      );
      throw new NotFoundException(`User doesn't exist`);
    }

    const isPasswordValid = await argon2.verify(
      foundUser.password,
      user.password
    );

    if (!isPasswordValid) {
      this.logger.log(
        `Tried to login user ${user.login} but the password is incorrect`,
        "Auth"
      );
      throw new ForbiddenException(`Password is incorrect`);
    }

    //TODO: Generate a token

    this.logger.log(`User ${user.login} has been logged in`, "Auth");

    return {
      id: foundUser.id,
      email: foundUser.email,
      login: foundUser.login,
    };
  }
}
