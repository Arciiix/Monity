import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PORT } from "./defaultConfig";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get<ConfigService>(ConfigService);
  const portToRunOn = config.get("PORT") || PORT;

  await app.listen(portToRunOn);
}
bootstrap();
