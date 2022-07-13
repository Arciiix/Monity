import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import {
  IsEnum,
  IsHexColor,
  IsNumber,
  IsString,
  Length,
  Matches,
  Min,
} from "class-validator";

export enum AccountIcons {
  "wallet",
  "piggy-bank",
  "credit-card",
  "money-bill",
  "university",
  "coins",
  "chart-line",
  "dollar-sign",
  "euro-sign",
  "home",
  "school",
  "atlas",
  "bus",
  "gift",
  "box",
  "briefcase",
  "calculator",
}

export class CreateAccountDto {
  @IsString()
  @Length(1, 20)
  @Matches(/^[A-Za-z0-9.\-\_\s]+$/)
  @ApiProperty({
    type: String,
    description: "Account name",
  })
  name: string;

  @IsEnum(AccountIcons)
  @ApiProperty({
    enum: AccountIcons,
    description: "An icon for the account (from the enum)",
  })
  icon: AccountIcons;

  @IsHexColor()
  @ApiProperty({
    type: String,
    description: "The account theme color",
  })
  color: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    type: Number,
    description: "The initial, starting account balance",
  })
  currentBalance: number;

  @IsString()
  @ApiProperty({
    type: "string",
    description: "The currency",
  })
  currency: string;
}

export class ReturnAccountDto extends OmitType(CreateAccountDto, [
  "currentBalance",
] as const) {
  @ApiProperty({
    type: String,
    description: "Account id",
  })
  id: string;

  @ApiProperty({
    type: Number,
    description: "The current account balance",
  })
  currentBalance: number;
}

export class UpdateAccountDto extends PartialType(
  OmitType(CreateAccountDto, ["currentBalance"] as const)
) {
  @IsString()
  @ApiProperty({
    type: String,
    description: "Account id",
  })
  id: string;
}
