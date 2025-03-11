import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Doctor Booking System API')
    .setDescription('API for managing doctor appointment slots and bookings')
    .setVersion('1.0')
    .addTag('doctors', 'Doctor management endpoints')
    .addTag('slots', 'Slot management endpoints')
    .addTag('bookings', 'Booking management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
