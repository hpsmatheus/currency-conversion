import { Injectable } from '@nestjs/common';
import CurrencyConversionApiClient from 'src/client/currency-conversion-api.client';
import ApiException from 'src/core/error/api-exception';
import CurrencyConversionParams from 'src/typings/currency-conversion/currency-conversion.params.dto';
import CurrencyConversionResponse from 'src/typings/currency-conversion/currency-conversion.response.dto';
import { Currency, ECurrencyType } from 'src/typings/currency/currency.entity';
import CurrencyService from '../currency/currency.service';

@Injectable()
export default class CurrencyConversionService {
  constructor(
    private readonly conversionClient: CurrencyConversionApiClient,
    private readonly currencyService: CurrencyService,
  ) {}

  public async convert(
    params: CurrencyConversionParams,
  ): Promise<CurrencyConversionResponse> {
    const { from, to, amount } = params;
    const currencies = await this.getCurrencies(from, to);

    const originaryCurrency = currencies.find(
      (currency) => currency.symbol === from,
    );

    const destinationCurrency = currencies.find(
      (currency) => currency.symbol === to,
    );

    if (
      originaryCurrency.type !== ECurrencyType.FICTIOUS &&
      destinationCurrency.type !== ECurrencyType.FICTIOUS
    ) {
      const conversionResult = await this.conversionClient.convert(from, [to]);
      const quotation = Object.values(conversionResult.quotation)[0];
      return {
        ...conversionResult,
        conversion: this.formatMoney(quotation * amount),
      };
    }

    if (
      originaryCurrency.type === ECurrencyType.FICTIOUS &&
      destinationCurrency.type !== ECurrencyType.FICTIOUS
    ) {
      if (!originaryCurrency.usdQuotation) {
        throw ApiException.inputValidation(
          null,
          `Could not find any quotation to ${from}`,
        );
      }
      const conversionResult = await this.conversionClient.convert(to, ['USD']);
      const quotation =
        Object.values(conversionResult.quotation)[0] *
        originaryCurrency.usdQuotation;
      return {
        estimatedUpdate: originaryCurrency.updatedAt,
        quotation: JSON.parse(`{"${to}": ${quotation}}`),
        conversion: this.formatMoney(quotation * amount),
      };
    }

    if (
      originaryCurrency.type !== ECurrencyType.FICTIOUS &&
      destinationCurrency.type === ECurrencyType.FICTIOUS
    ) {
      if (!destinationCurrency.usdQuotation) {
        throw ApiException.inputValidation(
          null,
          `Could not find any quotation to ${to}`,
        );
      }
      const conversionResult = await this.conversionClient.convert(from, [
        'USD',
      ]);
      const quotation =
        Object.values(conversionResult.quotation)[0] *
        destinationCurrency.usdQuotation;
      return {
        estimatedUpdate: destinationCurrency.updatedAt,
        quotation: JSON.parse(`{"${to}": ${quotation}}`),
        conversion: this.formatMoney(quotation * amount),
      };
    } else {
      if (!originaryCurrency.usdQuotation) {
        throw ApiException.inputValidation(
          null,
          `Could not find any quotation to ${to}`,
        );
      }

      if (!destinationCurrency.usdQuotation) {
        throw ApiException.inputValidation(
          null,
          `Could not find any quotation to ${from}`,
        );
      }

      const quotation =
        originaryCurrency.usdQuotation * destinationCurrency.usdQuotation;

      return {
        estimatedUpdate: destinationCurrency.updatedAt, //take the lower date
        quotation: JSON.parse(`{"${to}": ${quotation}}`),
        conversion: this.formatMoney(quotation * amount),
      };
    }
  }

  private formatMoney(value: number): number {
    const decimalPlaces = 2;
    return Number(value.toFixed(decimalPlaces));
  }

  private async getCurrencies(from: string, to: string): Promise<Currency[]> {
    const currencies = await this.currencyService.findAllBySymbol([from, to]);
    if (currencies.length !== 2)
      throw ApiException.notFound(
        null,
        `Could not find all the requested currencies. Currencies found: ${currencies
          .map((c) => c.symbol)
          .join(',')}`,
      );

    return currencies;
  }
}
