import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Account } from "@prisma/client";
import { Timestamp } from "src/global.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  AccountIcons,
  CreateAccountDto,
  ReturnAccountDto,
  UpdateAccountDto,
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

  async update(
    data: UpdateAccountDto,
    userId: string
  ): Promise<ReturnAccountDto> {
    if (!data.id) {
      throw new NotFoundException("Wrong id");
    }
    //Check if the account with the given id exists
    const account = await this.prismaService.account.findFirst({
      where: {
        id: data.id,
      },
    });

    if (!account) {
      throw new NotFoundException("Account with the given id doesn't exist");
    }

    if (account.userId !== userId) {
      throw new ForbiddenException("User doesn't possess this account");
    }

    const updated = await this.prismaService.account.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        ...{
          icon: data.icon ? data.icon.toString() : account.icon, //Icon from enum to string
        },
      },
    });

    this.logger.log(`Updated account ${data.id}`, "Account");
    return this.accountToReturnDto(updated);
  }

  async delete(id: string, userId: string): Promise<Timestamp> {
    //Find the account
    const account = await this.prismaService.account.findFirst({
      where: {
        id,
      },
    });
    if (!account) {
      throw new NotFoundException("Account with the given id doesn't exist");
    }

    if (account.userId !== userId) {
      throw new ForbiddenException("User doesn't possess this account");
    }

    //Check how many accounts user has
    const accountAmount = await this.prismaService.account.count({
      where: {
        userId,
      },
    });
    if (accountAmount <= 1) {
      throw new ConflictException("User has to have at least one account");
    }

    await this.prismaService.account.delete({
      where: {
        id,
      },
    });
    this.logger.log(`Account ${id} has been deleted`);
    return { timestamp: new Date() };
  }
}
