import { Controller, Get, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('quotes')
@UseGuards(AuthGuard('jwt'))
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}
  @Get('random')
  async getRandomQuote() {
    return this.quotesService.getRandomQuote();
  }
}
