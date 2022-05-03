import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { PORT } from "./defaultConfig";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("v1");

  const apiDocsConfig = new DocumentBuilder()
    .setTitle("Monity")
    .setDescription("Description of the Monity REST API")
    .build();
  const apiDocsDocument = SwaggerModule.createDocument(app, apiDocsConfig);
  SwaggerModule.setup("docs", app, apiDocsDocument);

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get<ConfigService>(ConfigService);
  const portToRunOn = config.get("PORT") || PORT;

  await app.listen(portToRunOn);
}
bootstrap();
