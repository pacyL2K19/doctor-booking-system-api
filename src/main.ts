import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import {
  ApiResponseSchema,
  ApiErrorResponseSchema,
  PaginatedApiResponseSchema,
  PaginationMetaSchema,
  ErrorDetailsSchema,
} from './common/schemas/api-response.schema';
import { PaginationDto, PaginationMeta } from './common/dtos/pagination.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  // Global ValidationPipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Apply global interceptor for response transformation
  app.useGlobalInterceptors(new TransformInterceptor());

  // Apply global exception filters
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  app.enableCors();

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Doctor Booking System API')
    .setDescription(
      `
      API for managing doctor appointment slots and bookings.
      All API responses are standardized with the following format:
      - Success responses: { success: true, code: 200, message: "Success message", data: {...} }
      - Error responses: { success: false, code: 400, message: "Error message", error: {...} }
    `,
    )
    .setVersion('1.0')
    .addTag('doctors', 'Doctor management endpoints')
    .addTag('slots', 'Slot management endpoints')
    .addTag('bookings', 'Booking management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      ApiResponseSchema,
      ApiErrorResponseSchema,
      PaginatedApiResponseSchema,
      PaginationMetaSchema,
      ErrorDetailsSchema,
      PaginationDto,
      PaginationMeta,
    ],
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api`,
  );
}
bootstrap();
