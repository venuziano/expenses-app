import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { AppEnvConfigService } from './config/environment-variables/app-env.config';
import { AllExceptionsFilter } from './helpers/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.enableCors({
    origin: 'http://localhost:5173', // your React dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // credentials: true, // if you ever send cookies/auth headers
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Retrieve the configuration service instance
  const configService = app.get(AppEnvConfigService);

  // Use the configuration service to get the port
  const port = configService.apiPort;

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Expenses API')
    .setDescription('description here.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Listen on the port specified by the configuration service
  await app.listen(port);
}
bootstrap();
