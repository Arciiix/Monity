import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { PORT } from "./defaultConfig";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("v1");

  const apiDocsConfig = new DocumentBuilder()
    .setTitle("Monity")
    .setDescription(
      "The REST API of Monity - personal finance manager, budget tracker, and analyzer that helps you monitor your money."
    )
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
    })
  );

  const config = app.get<ConfigService>(ConfigService);
  const portToRunOn = config.get("PORT") || PORT;

  await app.listen(portToRunOn);
  logger.log(`Server running on port ${portToRunOn}`, "Bootstrap");
}
bootstrap();
