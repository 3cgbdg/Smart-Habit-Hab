import { LoggerInterceptor } from './logger.interceptor';
import { ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { of } from 'rxjs';

const mockContext = (method = 'GET', url = '/test', statusCode = 200): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ method, url }),
      getResponse: () => ({ statusCode }),
    }),
  }) as unknown as ExecutionContext;

const mockCallHandler = (returnValue: unknown = {}): CallHandler => ({
  handle: () => of(returnValue),
});

describe('LoggerInterceptor', () => {
  let interceptor: LoggerInterceptor;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggerInterceptor();
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => jest.clearAllMocks());

  it('should pass through the next handler response unchanged', (done) => {
    const context = mockContext();
    const next = mockCallHandler({ data: 'test' });

    interceptor.intercept(context, next).subscribe({
      next: (value) => {
        expect(value).toEqual({ data: 'test' });
        done();
      },
    });
  });

  it('should log method, url, status code, and response time in ms', (done) => {
    const context = mockContext('POST', '/habits', 201);
    const next = mockCallHandler({});

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/POST.*\/habits.*201.*ms/));
        done();
      },
    });
  });

  it('should include response time as a number ending in ms', (done) => {
    const context = mockContext('GET', '/profiles/me', 200);
    const next = mockCallHandler({});

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/\d+ms/));
        done();
      },
    });
  });
});
