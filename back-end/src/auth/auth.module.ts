import { Logger, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JWTStrategy } from "./auth.strategy";
import { TwoFaService } from "./twoFa.service";

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  providers: [AuthService, Logger, JWTStrategy, TwoFaService],
  controllers: [AuthController],
})
export class AuthModule {}
