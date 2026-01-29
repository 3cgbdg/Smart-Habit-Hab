import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({
    timeout: 15000,
    maxRedirects: 5
  }),],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule { }
