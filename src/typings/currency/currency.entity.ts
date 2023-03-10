export enum ECurrencyType {
  FIAT = 'FIAT',
  CRYPTO = 'CRYPTO',
  FICTIOUS = 'FICTIOUS',
}
export class Currency {
  name: string;

  symbol: string;

  quotationUSDToCurrency?: number;

  quotationCurrencyToUSD?: number;

  createdAt: Date;

  updatedAt: Date;

  type: ECurrencyType;
}
