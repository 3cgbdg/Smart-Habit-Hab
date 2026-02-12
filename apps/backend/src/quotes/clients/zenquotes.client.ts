// src/quotes/clients/zen-quotes.client.ts
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IQuoteResponse } from 'src/types/quotes';
import { QUOTES_CONSTANTS } from '../../constants/quotes';

@Injectable()
export class ZenQuotesClient {
  private readonly logger = new Logger(ZenQuotesClient.name);
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl =
      this.configService.get<string>('QUOTES_API_URL') ||
      QUOTES_CONSTANTS.BASE_URL;
  }

  async fetchRandomQuote(): Promise<IQuoteResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IQuoteResponse>(`${this.apiUrl}/random`),
      );
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to call ZenQuotes: ${message}`);
      throw error;
    }
  }
}
