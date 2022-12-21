import { Injectable } from '@nestjs/common';
import CurrencyConversionApiClient from 'src/client/currency-conversion-api.client';
import CurrencyConversionParams from 'src/typings/currency-conversion/currency-conversion.params.dto';
import CurrencyConversionResponse from 'src/typings/currency-conversion/currency-conversion.response.dto';

@Injectable()
export default class CurrencyConversionService {
  constructor(private readonly conversionClient: CurrencyConversionApiClient) {}

  public async convert(
    params: CurrencyConversionParams,
  ): Promise<CurrencyConversionResponse> {
    const { from, to, amount } = params;
    const conversionResult = await this.conversionClient.convert(from, [to]);
    const quotation = Object.values(conversionResult.quotation)[0];
    return {
      ...conversionResult,
      conversion: this.formatMoney(quotation * amount),
    };
  }

  private formatMoney(value: number): number {
    const decimalPlaces = 2;
    return Number(value.toFixed(decimalPlaces));
  }
}
