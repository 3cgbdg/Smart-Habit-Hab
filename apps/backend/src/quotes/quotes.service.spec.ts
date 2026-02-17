import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from './quotes.service';
import { ZenQuotesClient } from './clients/zenquotes.client';
import { HttpException } from '@nestjs/common';

const mockZenQuotesClient = () => ({
  fetchRandomQuote: jest.fn(),
});

describe('QuotesService', () => {
  let service: QuotesService;
  let zenQuotesClient: ReturnType<typeof mockZenQuotesClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotesService, { provide: ZenQuotesClient, useFactory: mockZenQuotesClient }],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
    zenQuotesClient = module.get(ZenQuotesClient);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getRandomQuote', () => {
    it('should return a formatted quote from ZenQuotes', async () => {
      zenQuotesClient.fetchRandomQuote.mockResolvedValue([
        { q: 'Do or do not, there is no try.', a: 'Yoda' },
      ]);

      const result = await service.getRandomQuote();

      expect(result).toEqual({
        data: { content: 'Do or do not, there is no try.', author: 'Yoda' },
      });
    });

    it('should throw Http 500 when the client throws', async () => {
      zenQuotesClient.fetchRandomQuote.mockRejectedValue(new Error('Network error'));

      await expect(service.getRandomQuote()).rejects.toThrow(HttpException);
      await expect(service.getRandomQuote()).rejects.toMatchObject({ status: 500 });
    });

    it('should throw Http 500 when response is empty array', async () => {
      zenQuotesClient.fetchRandomQuote.mockResolvedValue([]);

      await expect(service.getRandomQuote()).rejects.toThrow(HttpException);
    });
  });
});
