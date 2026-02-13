import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
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

    let errorMessage: string;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as Record<string, unknown>;
      errorMessage =
        typeof responseObj.message === 'string'
          ? responseObj.message
          : JSON.stringify(exceptionResponse);
    } else {
      errorMessage = String(exceptionResponse);
    }

    this.logger.error(`${request.method} ${request.url} ${status} - Error: ${errorMessage}`);

    response.status(status).json({
      statusCode: status,
      path: request.url,
      error: exceptionResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
