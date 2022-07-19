import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { basicNameRegEx } from "src/utils/regExps";

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
  @Matches(basicNameRegEx)
  @Length(3, 128)
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: "Notes about the person",
  })
  @IsString()
  @Matches(basicNameRegEx)
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
