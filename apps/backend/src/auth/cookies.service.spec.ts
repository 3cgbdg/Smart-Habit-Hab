import { Test, TestingModule } from '@nestjs/testing';
import { CookiesService } from './cookies.service';
import { ConfigService } from '@nestjs/config';
import { AUTH_CONSTANTS } from 'src/constants/auth';

const mockResponse = () => ({
  cookie: jest.fn(),
  clearCookie: jest.fn(),
});

const mockConfigService = (nodeEnv: string = 'development') => ({
  get: jest.fn().mockReturnValue(nodeEnv),
});

describe('CookiesService', () => {
  let service: CookiesService;
  let res: ReturnType<typeof mockResponse>;

  const buildService = async (nodeEnv = 'development') => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookiesService, { provide: ConfigService, useValue: mockConfigService(nodeEnv) }],
    }).compile();
    return module.get<CookiesService>(CookiesService);
  };

  beforeEach(async () => {
    service = await buildService();
    res = mockResponse();
  });

  afterEach(() => jest.clearAllMocks());

  describe('setCookies', () => {
    it('should set both access and refresh cookies', () => {
      service.setCookies(res as never, 'acc-token', 'ref-token');

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenNthCalledWith(
        1,
        'access_token',
        'acc-token',
        expect.any(Object),
      );
      expect(res.cookie).toHaveBeenNthCalledWith(
        2,
        'refresh_token',
        'ref-token',
        expect.any(Object),
      );
    });
  });

  describe('setAccessCookie', () => {
    it('should set httpOnly, non-secure, lax cookie in development', () => {
      service.setAccessCookie(res as never, 'acc-token');

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'acc-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: AUTH_CONSTANTS.MAX_ACCESS_COOKIE_AGE,
      });
    });

    it('should set secure, none sameSite cookie in production', async () => {
      const prodService = await buildService('production');
      prodService.setAccessCookie(res as never, 'acc-token');

      expect(res.cookie).toHaveBeenCalledWith('access_token', 'acc-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: AUTH_CONSTANTS.MAX_ACCESS_COOKIE_AGE,
      });
    });
  });

  describe('setRefreshCookie', () => {
    it('should use the correct maxAge from AUTH_CONSTANTS', () => {
      service.setRefreshCookie(res as never, 'ref-token');

      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'ref-token',
        expect.objectContaining({ maxAge: AUTH_CONSTANTS.MAX_REFRESH_COOKIE_AGE }),
      );
    });
  });

  describe('clearCookies', () => {
    it('should clear both access_token and refresh_token cookies', () => {
      service.clearCookies(res as never);

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.clearCookie).toHaveBeenNthCalledWith(1, 'access_token', expect.any(Object));
      expect(res.clearCookie).toHaveBeenNthCalledWith(2, 'refresh_token', expect.any(Object));
    });

    it('should pass httpOnly flag when clearing', () => {
      service.clearCookies(res as never);

      expect(res.clearCookie).toHaveBeenNthCalledWith(
        1,
        'access_token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.clearCookie).toHaveBeenNthCalledWith(
        2,
        'refresh_token',
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });
});
