import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { ValidationError } from 'class-validator';
  
  @Catch(HttpException)
  export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception.getStatus();
  
      const errorResponse = exception.getResponse();
      let errors: any = [];
  
      if (typeof errorResponse === 'object' && 'message' in errorResponse) {
        errors = errorResponse.message;
      }
  
      if (Array.isArray(errorResponse)) {
        errors = errorResponse;
      }
  
      if (errors instanceof Array) {
        errors = this.formatValidationErrors(errors);
      }
  
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        errors,
      });
    }
  
    private formatValidationErrors(errors: ValidationError[]) {
      return errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
    }
  }
  