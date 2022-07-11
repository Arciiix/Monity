import { Logger, Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AccountController],
  providers: [AccountService, Logger],
})
export class AccountModule {}
