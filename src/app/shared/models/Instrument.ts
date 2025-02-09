export interface Instrument {
  id: string;
  symbol: string;
  currency: string;
  baseCurrency: string;
  price?: number;
  timestamp?: string;
}
