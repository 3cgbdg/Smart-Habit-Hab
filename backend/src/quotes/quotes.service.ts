import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IQuoteResponse } from 'src/types/quotes';

@Injectable()
export class QuotesService {
  constructor(private readonly httpService: HttpService) {}
  private readonly apiUrl = 'https://zenquotes.io/api';
  async getRandomQuote() {
    try {
      const response = await firstValueFrom(
        this.httpService.get<IQuoteResponse>(`${this.apiUrl}/random`),
      );
      const quote = response.data[0];
      if (!quote) throw new Error('No quote found');

      return {
        data: { author: quote.a, content: quote.q },
      };
    } catch {
      throw new HttpException(
        'Failed to fetch quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
