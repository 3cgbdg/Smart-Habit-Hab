import { Test, TestingModule } from '@nestjs/testing';
import { ZenQuotesClient } from './zenquotes.client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { QUOTES_CONSTANTS } from 'src/constants/quotes';

const mockHttpService = () => ({ get: jest.fn() });
const mockConfigService = (url?: string) => ({
  get: jest.fn().mockReturnValue(url),
});

describe('ZenQuotesClient', () => {
  let client: ZenQuotesClient;
  let httpService: HttpService;

  const buildClient = async (apiUrl?: string) => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZenQuotesClient,
        { provide: HttpService, useFactory: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService(apiUrl) },
      ],
    }).compile();
    return {
      client: module.get<ZenQuotesClient>(ZenQuotesClient),
      httpSvc: module.get<HttpService>(HttpService),
    };
  };

  beforeEach(async () => {
    const built = await buildClient('https://zenquotes.io/api');
    client = built.client;
    httpService = built.httpSvc;
  });

  afterEach(() => jest.clearAllMocks());

  describe('fetchRandomQuote', () => {
    it('should return data from a successful HTTP call', async () => {
      const mockData = [{ q: 'Be yourself.', a: 'Oscar Wilde' }];
      (httpService.get as any).mockReturnValue(of({ data: mockData }));

      const result = await client.fetchRandomQuote();

      expect(httpService.get as any).toHaveBeenCalledWith('https://zenquotes.io/api/random');
      expect(result).toEqual(mockData);
    });

    it('should throw and log error when HTTP call fails', async () => {
      (httpService.get as any).mockReturnValue(throwError(() => new Error('Connection refused')));

      await expect(client.fetchRandomQuote()).rejects.toThrow('Connection refused');
    });
  });

  describe('api URL configuration', () => {
    it('should use ConfigService URL when provided', async () => {
      const { client: c, httpSvc } = await buildClient('https://custom-api.com');
      (httpSvc.get as any).mockReturnValue(of({ data: [] }));

      await c.fetchRandomQuote();

      expect(httpSvc.get as any).toHaveBeenCalledWith('https://custom-api.com/random');
    });

    it('should fall back to QUOTES_CONSTANTS.BASE_URL when config is undefined', async () => {
      const { client: c, httpSvc } = await buildClient(undefined);
      (httpSvc.get as any).mockReturnValue(of({ data: [] }));

      await c.fetchRandomQuote();

      expect(httpSvc.get as any).toHaveBeenCalledWith(`${QUOTES_CONSTANTS.BASE_URL}/random`);
    });
  });
});
