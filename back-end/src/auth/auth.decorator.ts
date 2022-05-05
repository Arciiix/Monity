import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";
import { JWTAuthGuard } from "./auth.guard";

export const Auth = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiCookieAuth(),
    UseGuards(JWTAuthGuard)
  );
};
