import { ApiProperty } from "@nestjs/swagger";

class TwoFaDto {
  @ApiProperty({
    type: String,
    description: "Two factor authentication secret",
  })
  secret: string;

  @ApiProperty({
    type: String,
    description: "Two factor authentication URL (otp auth url)",
  })
  otpauthUrl: string;

  @ApiProperty({
    type: String,
    description: "Two factor authentication recovery code",
  })
  recoveryCode: string;
}

class TwoFaStatus {
  @ApiProperty({
    type: Boolean,
    description: "Two factor authentication status",
  })
  isEnabled: boolean;

  @ApiProperty({
    type: TwoFaDto,
    description: "Two factor authentication data",
  })
  data: TwoFaDto;
}

export { TwoFaDto, TwoFaStatus };
