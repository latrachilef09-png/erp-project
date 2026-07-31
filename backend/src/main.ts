import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
  new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(
  new LoggingInterceptor(),
  );

  const config = new DocumentBuilder()
    .setTitle('ERP API')
    .setDescription('ERP Backend API')
    .setVersion('1.0')
    .addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  'access-token',
)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
}

bootstrap();