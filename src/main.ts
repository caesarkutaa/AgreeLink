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

  app.setGlobalPrefix('/v1/api');
  app.enableCors();

  app.useGlobalFilters(new GlobalExceptionFilter());
  
  await app.listen(3000);
}

bootstrap();


