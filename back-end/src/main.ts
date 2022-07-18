import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix(config.get("API_VERSION"));
  const portToRunOn = config.get("PORT");

  app.enableCors({
    credentials: true,
    origin: true,
  });

  const apiDocsConfig = new DocumentBuilder()
    .setTitle("Monity")
    .setDescription(
      "The REST API of Monity - personal finance manager, budget tracker, and analyzer that helps you monitor your money."
    )
    .addTag("auth", "User authentication")
    .addTag("user", "User data and info, e.g. avatar")
    .addTag("account", "Managing accounts")
    .addTag("person", "Managing people, i.e. receivers and senders")
    .addBearerAuth()
    .addCookieAuth("accessToken")
    .build();
  const apiDocsDocument = SwaggerModule.createDocument(app, apiDocsConfig);
  SwaggerModule.setup("docs", app, apiDocsDocument);

  const logger = new Logger();

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        logger.log(errors, "Validation");

        const errorMessages = {};
        errors.forEach((error) => {
          errorMessages[error.property] = Object.values(error.constraints);
        });

        throw new BadRequestException({
          statusCode: 400,
          error: "Bad Request",
          errors: errorMessages,
        });
      },
      whitelist: true,
    })
  );

  await app.listen(portToRunOn);
  logger.log(`Server running on port ${portToRunOn}`, "Bootstrap");
}
bootstrap();
