import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  Delete,
} from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Auth } from "src/auth/auth.decorator";
import { RequestWithUser, Timestamp } from "src/global.dto";
import { AccountService } from "./account.service";
import {
  CreateAccountDto,
  ReturnAccountDto,
  UpdateAccountDto,
} from "./dto/account.dto";

@Controller("account")
@ApiTags("account")
@ApiForbiddenResponse({
  description: "User isn't authenticated",
})
@Auth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOkResponse({
    description: "Get all user accounts",
    type: ReturnAccountDto,
    isArray: true,
  })
  async findAll(@Req() req: RequestWithUser): Promise<ReturnAccountDto[]> {
    return await this.accountService.findAll(req.user.id);
  }

  @Get(":id")
  @ApiOkResponse({
    description: "Get account with the given id",
    type: ReturnAccountDto,
  })
  @ApiNotFoundResponse({
    description: "Account has not been found",
  })
  @ApiForbiddenResponse({
    description: "User doesn't possess this account",
  })
  async findOne(
    @Param("id") id: string,
    @Req() req: RequestWithUser
  ): Promise<ReturnAccountDto> {
    return await this.accountService.findById(id, req.user.id);
  }

  @Post()
  @ApiCreatedResponse({
    description: "An account has been created",
    type: ReturnAccountDto,
  })
  @ApiConflictResponse({
    description: "Account with the given name already exists",
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() body: CreateAccountDto
  ): Promise<ReturnAccountDto> {
    return await this.accountService.create(body, req.user.id);
  }

  @Put()
  @ApiOkResponse({
    description: "The account has been updated",
    type: ReturnAccountDto,
  })
  @ApiNotFoundResponse({
    description:
      "Account with the given id has not been found or it's not a valid id",
  })
  @ApiForbiddenResponse({
    description: "User doesn't possess this account",
  })
  async update(
    @Req() req: RequestWithUser,
    @Body() body: UpdateAccountDto
  ): Promise<ReturnAccountDto> {
    return await this.accountService.update(body, req.user.id);
  }

  @Delete(":id")
  @ApiOkResponse({
    description: "The account has been deleted",
    type: Timestamp,
  })
  @ApiNotFoundResponse({
    description: "Account with the given id has not been found",
  })
  @ApiForbiddenResponse({
    description: "User doesn't possess this account",
  })
  async delete(
    @Req() req: RequestWithUser,
    @Param("id") id: string
  ): Promise<Timestamp> {
    return await this.accountService.delete(id, req.user.id);
  }
}
