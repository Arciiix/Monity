import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Request } from "express";

class Timestamp {
  @ApiProperty({ type: Date, description: "timestamp" })
  timestamp: Date;
}

interface RequestWithUser extends Request {
  user: User;
}

export { Timestamp, RequestWithUser };
