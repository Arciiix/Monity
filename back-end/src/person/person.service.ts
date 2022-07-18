import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Person } from "@prisma/client";
import { Timestamp } from "src/global.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreatePersonDto,
  PersonCategories,
  ReturnPersonDto,
  UpdatePersonDto,
} from "./dto/person.dto";

@Injectable()
export class PersonService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService
  ) {}

  toReturnDto(person: Person): ReturnPersonDto {
    return {
      name: person.name,
      notes: person.notes,
      category: person.category as unknown as PersonCategories,
      isFavorite: person.isFavorite,
      id: person.id,
    };
  }

  async findAll(userId: string): Promise<ReturnPersonDto[]> {
    const people = await this.prismaService.person.findMany({
      where: {
        userId,
      },
    });

    this.logger.log(`Got all people of user ${userId}`, "Person");
    return people.map(this.toReturnDto);
  }

  async findById(id: string, userId: string): Promise<ReturnPersonDto> {
    const person = await this.prismaService.person.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!person) {
      throw new NotFoundException("Person not found");
    }

    this.logger.log(`Got person ${id}`, "Person");
    return this.toReturnDto(person);
  }

  async create(
    createPersonDto: CreatePersonDto,
    userId: string
  ): Promise<ReturnPersonDto> {
    //Allow duplicates (some people can have the same name, then they're recognized by categories and/or notes)
    const newPerson = await this.prismaService.person.create({
      data: {
        userId: userId,
        name: createPersonDto.name,
        notes: createPersonDto.notes,
        category: createPersonDto.category.toString(),
        isFavorite: createPersonDto.isFavorite,
      },
    });

    this.logger.log(`Created new person ${newPerson.id}`, "Person");

    return this.toReturnDto(newPerson);
  }

  async update(
    data: UpdatePersonDto,
    userId: string
  ): Promise<ReturnPersonDto> {
    if (!data.id) {
      throw new NotFoundException("Wrong id");
    }
    //Check if the person exists
    const person = await this.prismaService.person.findFirst({
      where: {
        id: data.id,
        userId,
      },
    });

    if (!person) {
      throw new NotFoundException("Person not found");
    }

    const updated = await this.prismaService.person.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        ...{
          category: data.category ? data.category.toString() : person.category, //Category from enum to string
        },
      },
    });

    this.logger.log(`Updated person ${data.id}`, "Person");
    return this.toReturnDto(updated);
  }

  async delete(id: string, userId: string): Promise<Timestamp> {
    //Check if the person associated with the user exists
    const person = await this.prismaService.person.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!person) {
      throw new NotFoundException("Person not found");
    }

    await this.prismaService.person.delete({
      where: {
        id: person.id,
      },
    });

    //TODO: In the future, set the receiver/sender of transactions (where the person was selected as so) to null

    return { timestamp: new Date() };
  }
}
