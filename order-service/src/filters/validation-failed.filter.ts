
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';
import { ApiValidationError } from '../interfaces/api-validation-error.interface';

@Catch(ValidationFailedException)
export class ValidationFailedFilter implements ExceptionFilter {
  catch(exception: ValidationFailedException, host: ArgumentsHost) {
    const errors = exception.errors;
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // const status = exception.getStatus();

    response
      .status(422)
      .json({
        error: true,
        message: 'validation failed',
        errors,
      });
  }
}
