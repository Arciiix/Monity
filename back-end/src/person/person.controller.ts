import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Auth } from "src/auth/auth.decorator";
import { RequestWithUser, Timestamp } from "src/global.dto";
import {
  CreatePersonDto,
  ReturnPersonDto,
  UpdatePersonDto,
} from "./dto/person.dto";
import { PersonService } from "./person.service";

@Controller("person")
@ApiTags("person")
@ApiForbiddenResponse({
  description: "User isn't authenticated",
})
@Auth()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  @ApiOkResponse({
    description: "Get all people",
    type: ReturnPersonDto,
    isArray: true,
  })
  async findAll(@Req() req: RequestWithUser): Promise<ReturnPersonDto[]> {
    return await this.personService.findAll(req.user.id);
  }

  @Get(":id")
  @ApiOkResponse({
    description: "Get person by id",
    type: ReturnPersonDto,
  })
  @ApiNotFoundResponse({
    description: "Person not found",
  })
  async findOne(
    @Param("id") id: string,
    @Req() req: RequestWithUser
  ): Promise<ReturnPersonDto> {
    return await this.personService.findById(id, req.user.id);
  }

  @Post()
  @ApiCreatedResponse({
    description: "Person has been created",
    type: ReturnPersonDto,
  })
  async create(
    @Body() createPersonDto: CreatePersonDto,
    @Req() req: RequestWithUser
  ): Promise<ReturnPersonDto> {
    return await this.personService.create(createPersonDto, req.user.id);
  }

  @Put()
  @ApiOkResponse({
    description: "The person has been updated",
    type: ReturnPersonDto,
  })
  @ApiNotFoundResponse({
    description: "Person not found",
  })
  async update(
    @Body() updatePersonDto: UpdatePersonDto,
    @Req() req: RequestWithUser
  ): Promise<ReturnPersonDto> {
    return await this.personService.update(updatePersonDto, req.user.id);
  }

  @Delete(":id")
  @ApiOkResponse({
    description: "Person has been deleted",
    type: Timestamp,
  })
  @ApiNotFoundResponse({
    description: "Person not found",
  })
  async delete(
    @Param("id") id: string,
    @Req() req: RequestWithUser
  ): Promise<Timestamp> {
    return this.personService.delete(id, req.user.id);
  }
}
