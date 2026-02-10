// src/quotes/clients/zen-quotes.client.ts
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IQuoteResponse } from 'src/types/quotes';

@Injectable()
export class ZenQuotesClient {
  private readonly logger = new Logger(ZenQuotesClient.name);
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('QUOTES_API_URL') || 'https://zenquotes.io/api';
  }

  async fetchRandomQuote(): Promise<IQuoteResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IQuoteResponse>(`${this.apiUrl}/random`),
      );
      return data;
    } catch (error) {
      this.logger.error(`Failed to call ZenQuotes: ${error.message}`);
      throw error;
    }
  }
}