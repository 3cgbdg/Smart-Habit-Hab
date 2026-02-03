import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorMessage =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message || JSON.stringify(exceptionResponse)
        : exceptionResponse;

    this.logger.error(
      `${request.method} ${request.url} ${status} - Error: ${errorMessage}`,
    );

    response.status(status).json({
      statusCode: status,
      path: request.url,
      error: exceptionResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
