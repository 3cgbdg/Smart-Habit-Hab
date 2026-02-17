import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const mockRequest = (method = 'GET', url = '/test') => ({ method, url });

const mockArgumentsHost = (req: object, res: object): ArgumentsHost =>
  ({
    switchToHttp: () => ({
      getResponse: () => res,
      getRequest: () => req,
    }),
  }) as unknown as ArgumentsHost;

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return JSON with statusCode, path, error, and timestamp', () => {
    const res = mockResponse();
    const req = mockRequest();
    const host = mockArgumentsHost(req, res);
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, host);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        path: '/test',
        error: 'Not Found',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should extract errorMessage from object exception response', () => {
    const res = mockResponse();
    const req = mockRequest('POST', '/habits');
    const host = mockArgumentsHost(req, res);
    const exception = new HttpException(
      { message: 'Validation failed', statusCode: 400 },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, host);

    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Validation failed'));
  });

  it('should handle string exception response', () => {
    const res = mockResponse();
    const req = mockRequest();
    const host = mockArgumentsHost(req, res);
    const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    filter.catch(exception, host);

    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Unauthorized'));
  });

  it('should log the request method, url and status', () => {
    const res = mockResponse();
    const req = mockRequest('DELETE', '/auth/logout');
    const host = mockArgumentsHost(req, res);
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, host);

    expect(loggerSpy).toHaveBeenCalledWith(expect.stringMatching(/DELETE.*\/auth\/logout.*403/));
  });
});
