
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';
import { ApiValidationError } from '../interfaces/api-validation-error.interface';

@Catch(ValidationFailedException)
export class ValidationFailedFilter implements ExceptionFilter {
  catch(exception: ValidationFailedException, host: ArgumentsHost): ApiValidationError {
    const errors = exception.errors;
    
    return {
      error: true,
      message: 'validation failed',
      errors: errors.map(error => ({
        attribute: error.property,
        errors: Object.keys(error.constraints).map(key => error.constraints[key]),
      })),
    };
  }
}
