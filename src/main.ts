import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { instance } from 'logger/winston.logger';
import { GlobalExceptionFilter } from './exceptions/global-exceptions.filters';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  // Validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      return new UnprocessableEntityException({
        statusCode: 422,
        message: 'Validation failed',
        errors: errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        })),
      });
    },
  }));

  // Set global API prefix
  app.setGlobalPrefix('/v1/api');

  // Enable CORS
  app.enableCors();

  // Set up global exception filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Get port from environment variables or default to 3000
  const port = process.env.PORT || 3000;
  
  // Start the application
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
