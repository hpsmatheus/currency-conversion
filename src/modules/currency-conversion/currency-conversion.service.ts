import { Injectable } from '@nestjs/common';
import CurrencyConversionApiClient from '../../client/currency-conversion-api.client';
import DateUtil from '../../core/date.util';
import ApiException from '../../core/error/api-exception';
import CurrencyConversionParams from 'src/typings/currency-conversion/currency-conversion.params.dto';
import CurrencyConversionResponse from 'src/typings/currency-conversion/currency-conversion.response.dto';
import {
  Currency,
  ECurrencyType,
} from '../../typings/currency/currency.entity';
import CurrencyService from '../currency/currency.service';
import MoneyUtil from '../../core/money.util';

type Currencies = { originCurrency: Currency; destinationCurrency: Currency };

const USDCurrency = 'USD';

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
    const { originCurrency, destinationCurrency } = await this.getCurrencies(
      from,
      to,
    );

    if (
      originCurrency.type !== ECurrencyType.FICTIOUS &&
      destinationCurrency.type !== ECurrencyType.FICTIOUS
    ) {
      return this.convertNonFictious(
        originCurrency,
        destinationCurrency,
        amount,
      );
    }

    if (
      originCurrency.type === ECurrencyType.FICTIOUS &&
      destinationCurrency.type !== ECurrencyType.FICTIOUS
    ) {
      return this.convertFictiousToNonFictious(
        originCurrency,
        destinationCurrency,
        amount,
      );
    }

    if (
      originCurrency.type !== ECurrencyType.FICTIOUS &&
      destinationCurrency.type === ECurrencyType.FICTIOUS
    ) {
      return this.convertNonFictiousToFictious(
        originCurrency,
        destinationCurrency,
        amount,
      );
    } else {
      return this.convertFictious(originCurrency, destinationCurrency, amount);
    }
  }

  private async getCurrencies(from: string, to: string): Promise<Currencies> {
    const currencies = await this.currencyService.findAllBySymbol([from, to]);

    if (currencies.length !== 2)
      throw ApiException.notFound(
        null,
        `Could not find all the requested currencies. Currencies found: ${currencies
          .map((c) => c.symbol)
          .join(',')}`,
      );

    const originCurrency = currencies.find(
      (currency) => currency.symbol === from,
    );

    const destinationCurrency = currencies.find(
      (currency) => currency.symbol === to,
    );

    return { originCurrency, destinationCurrency };
  }

  private async convertNonFictious(
    originCurrency: Currency,
    destinationCurrency: Currency,
    amount: number,
  ): Promise<CurrencyConversionResponse> {
    const conversionResult = await this.conversionClient.convert(
      originCurrency.symbol,
      [destinationCurrency.symbol],
    );

    const quotation = Object.values(conversionResult.quotation)[0];

    return {
      ...conversionResult,
      conversion: MoneyUtil.format(quotation * amount),
    };
  }

  private async convertFictiousToNonFictious(
    originCurrency: Currency,
    destinationCurrency: Currency,
    amount: number,
  ): Promise<CurrencyConversionResponse> {
    if (!originCurrency.quotationCurrencyToUSD) {
      this.throwQuotationNotFound(originCurrency);
    }

    const conversionResult = await this.conversionClient.convert(USDCurrency, [
      destinationCurrency.symbol,
    ]);

    const quotation =
      Object.values(conversionResult.quotation)[0] *
      originCurrency.quotationCurrencyToUSD;

    return {
      estimatedUpdate: originCurrency.updatedAt,
      quotation: JSON.parse(`{"${destinationCurrency.symbol}": ${quotation}}`),
      conversion: MoneyUtil.format(quotation * amount),
    };
  }

  private async convertNonFictiousToFictious(
    originCurrency: Currency,
    destinationCurrency: Currency,
    amount: number,
  ): Promise<CurrencyConversionResponse> {
    if (!destinationCurrency.quotationUSDToCurrency) {
      this.throwQuotationNotFound(destinationCurrency);
    }

    const conversionResult = await this.conversionClient.convert(
      originCurrency.symbol,
      [USDCurrency],
    );

    const quotation =
      Object.values(conversionResult.quotation)[0] *
      destinationCurrency.quotationUSDToCurrency;

    return {
      estimatedUpdate: destinationCurrency.updatedAt,
      quotation: JSON.parse(`{"${destinationCurrency.symbol}": ${quotation}}`),
      conversion: MoneyUtil.format(quotation * amount),
    };
  }

  private convertFictious(
    originCurrency: Currency,
    destinationCurrency: Currency,
    amount: number,
  ): CurrencyConversionResponse {
    if (!originCurrency.quotationCurrencyToUSD) {
      this.throwQuotationNotFound(originCurrency);
    }

    if (!destinationCurrency.quotationUSDToCurrency) {
      this.throwQuotationNotFound(destinationCurrency);
    }

    const quotation =
      originCurrency.quotationCurrencyToUSD *
      destinationCurrency.quotationUSDToCurrency;

    return {
      estimatedUpdate: DateUtil.min([
        originCurrency.updatedAt,
        destinationCurrency.updatedAt,
      ]),
      quotation: JSON.parse(`{"${destinationCurrency.symbol}": ${quotation}}`),
      conversion: MoneyUtil.format(quotation * amount),
    };
  }

  private throwQuotationNotFound(currency: Currency): void {
    throw ApiException.inputValidation(
      null,
      `Could not find any quotation to ${currency.symbol}`,
    );
  }
}
