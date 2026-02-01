export interface IQuote {
  quote: string;
  author: string;
}

export interface IQuoteResponseItem {
  q: string;
  a: string;
}

export type IQuoteResponse = IQuoteResponseItem[];
