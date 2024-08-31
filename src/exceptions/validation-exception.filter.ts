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

    // Check if errorResponse is an object with a 'message' property
    if (typeof errorResponse === 'object' && 'message' in errorResponse) {
      if (Array.isArray(errorResponse.message)) {
        // If it's an array, format the validation errors
        errors = this.formatValidationErrors(errorResponse.message);
      } else {
        // Handle other cases (like an object with a message string)
        errors = [errorResponse.message];
      }
    } else if (Array.isArray(errorResponse)) {
      // If it's already an array of errors
      errors = this.formatValidationErrors(errorResponse);
    } else {
      // Handle other cases (like string messages)
      errors = [errorResponse];
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
