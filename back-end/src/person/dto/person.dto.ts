import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export enum PersonCategories {
  family,
  friends,
  work,
  shop,
  services,
  bills,
  other,
}

export class CreatePersonDto {
  @ApiProperty({
    type: String,
    description: "Name, e.g. first name and surname",
  })
  @IsString()
  @Length(3, 128)
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: "Notes about the person",
  })
  @IsString()
  @IsOptional()
  @Length(0, 1024)
  notes: string;

  @ApiProperty({
    enum: PersonCategories,
    description: "The category the person is related to",
  })
  @IsEnum(PersonCategories)
  category: PersonCategories;

  @ApiProperty({
    type: Boolean,
    description: "Is marked as favorite",
  })
  @IsBoolean()
  isFavorite: boolean;
}

export class ReturnPersonDto extends CreatePersonDto {
  @ApiProperty({
    type: String,
    description: "Person id",
  })
  @IsString()
  id: string;
}
export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  @ApiProperty({
    type: String,
    description: "Person id",
  })
  @IsString()
  id: string;
}
