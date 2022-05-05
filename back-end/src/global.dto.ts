import { ApiProperty } from "@nestjs/swagger";

class Timestamp {
  @ApiProperty({ type: Date, description: "timestamp" })
  timestamp: Date;
}

export { Timestamp };
