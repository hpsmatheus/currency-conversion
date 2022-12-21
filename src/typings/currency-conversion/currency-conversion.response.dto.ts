export default class CurrencyConversionResponse {
  estimatedUpdate: Date;

  quotation: Record<string, number>;

  conversion: number;
}
