
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

@Catch(EntityNotFoundException)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = 404;
    response
      .status(statusCode)
      .json({
        statusCode,
        message: 'Entity not found',
        path: request.url,
      });
  }
}
