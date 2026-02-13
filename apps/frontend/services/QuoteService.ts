import { ApiResponse } from '@/types/general';
import { IQuote } from '@/types/quote';
import { api } from './axiosInstance';

class QuoteService {
  async getRandomQuote(): Promise<ApiResponse<IQuote>> {
    const response = await api.get('/quotes/random');
    return response.data;
  }
}

const quoteService = new QuoteService();

export default quoteService;
