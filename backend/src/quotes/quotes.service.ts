import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuotesService {
    constructor(private readonly httpService: HttpService) { };
    private readonly apiUrl = 'https://zenquotes.io/api';
    async getRandomQuote() {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/random`)
            );
            return { data: { author: response.data[0].a, content: response.data[0].q } };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch quote',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
