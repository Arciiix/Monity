import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Account } from "@prisma/client";
import { Auth } from "src/auth/auth.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import {
  AccountIcons,
  CreateAccountDto,
  ReturnAccountDto,
} from "./dto/account.dto";

@Injectable()
export class AccountService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService
  ) {}

  //Return all properties except for initialBalance and userId. Parse the icon.
  accountToReturnDto({
    initialBalance,
    userId,
    icon,
    ...rest
  }: Account): ReturnAccountDto {
    return {
      ...{ icon: icon as unknown as AccountIcons },
      ...rest,
    };
  }

  async findAll(userId: string): Promise<ReturnAccountDto[]> {
    this.logger.log(`Got all accounts for user ${userId}`, "Account");
    const accounts: Account[] = await this.prismaService.account.findMany({
      where: {
        userId,
      },
    });
    return accounts.map(this.accountToReturnDto);
  }

  async findById(accountId: string, userId: string): Promise<ReturnAccountDto> {
    this.logger.log(`Find one account with id ${accountId}`, "Account");
    const account = await this.prismaService.account.findFirst({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw new NotFoundException("Account has not been found");
    }

    if (account.userId !== userId) {
      throw new ForbiddenException("User doesn't possess this account");
    }

    return this.accountToReturnDto(account);
  }

  async create(
    data: CreateAccountDto,
    userId: string
  ): Promise<ReturnAccountDto> {
    //Check if account with that name already exists
    const foundAccount = await this.prismaService.account.findFirst({
      where: {
        name: data.name,
        userId,
      },
    });
    if (foundAccount) {
      throw new ConflictException("Account with the given name already exists");
    }

    const response = await this.prismaService.account.create({
      data: {
        userId: userId,
        name: data.name,
        icon: data.icon.toString(),
        color: data.color,
        initialBalance: data.currentBalance,
        currentBalance: data.currentBalance,
        currency: data.currency,
      },
    });
    this.logger.log(`Created a new account for user ${userId}`, "Account");
    return this.accountToReturnDto(response);
  }
}
