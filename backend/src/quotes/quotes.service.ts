import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IQuoteResponse } from 'src/types/quotes';
import { Logger } from '@nestjs/common';
import { ZenQuotesClient } from './clients/zenquotes.client';

@Injectable()
export class QuotesService {
  constructor(private readonly zenQuotesClient: ZenQuotesClient) { }
  async getRandomQuote() {
    try {
      const response = await this.zenQuotesClient.fetchRandomQuote();

      const quote = response[0];
      if (!quote) throw new Error('Empty response from ZenQuotes');
      return {
        data: { author: quote.a, content: quote.q },
      };
    } catch (error) {
      throw new HttpException('Quote service is temporarily unavailable', 500);
    }
  }
}
