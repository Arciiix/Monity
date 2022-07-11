import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Account } from "@prisma/client";
import { Auth } from "src/auth/auth.decorator";
import { RequestWithUser } from "src/global.dto";
import { AccountService } from "./account.service";
import { CreateAccountDto, ReturnAccountDto } from "./dto/account.dto";

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

  //TODO: Delete and update endpoints
}
