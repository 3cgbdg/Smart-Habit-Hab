import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { HttpModule } from '@nestjs/axios';
import { ZenQuotesClient } from './clients/zenquotes.client';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
  ],
  controllers: [QuotesController],
  providers: [QuotesService, ZenQuotesClient],
})
export class QuotesModule {}
