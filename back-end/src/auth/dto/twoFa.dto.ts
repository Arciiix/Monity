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
}

export { TwoFaDto };
