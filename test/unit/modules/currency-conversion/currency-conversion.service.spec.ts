import { mock } from 'jest-mock-extended';
import { clientCurrencyConversionResponse } from '../../../mocks/client/client-currency-conversion.response.mock';
import { currencyConversionResponse } from '../../../mocks/currency-conversion/currency-conversion.response.mock';
import CurrencyConversionApiClient from '../../../../src/client/currency-conversion-api.client';
import CurrencyConversionService from '../../../../src/modules/currency-conversion/currency-conversion.service';
import CurrencyService from '../../../../src/modules/currency/currency.service';
import CurrencyConversionParams from '../../../../src/typings/currency-conversion/currency-conversion.params.dto';
import Constants from '../../../constants';
import { currenciesMock } from '../../../mocks/currency/currency.entity.mock';
import { EErrorCode } from '../../../../src/core/error/error-code.enum';
import { HttpStatus } from '@nestjs/common';
import ApiException from '../../../../src/core/error/api-exception';
import CurrencyConversionResponse from '../../../../src/typings/currency-conversion/currency-conversion.response.dto';
import DateUtil from '../../../../src/core/date.util';
import MoneyUtil from '../../../../src/core/money.util';

describe('Currency Conversion Service', () => {
  const conversionClient = mock<CurrencyConversionApiClient>();
  const currencyService = mock<CurrencyService>();
  const conversionService = new CurrencyConversionService(
    conversionClient,
    currencyService,
  );

  const usdQuotation = clientCurrencyConversionResponse(Constants.USDCurrency);

  const mockCurrencyServiceReturnFiatAndFictious = (): void => {
    currencyService.findAllBySymbol.mockResolvedValueOnce([
      currenciesMock.fictious,
      currenciesMock.fiat,
    ]);
  };

  it('should return exception to non-registered currencies', async () => {
    currencyService.findAllBySymbol.mockResolvedValueOnce([
      currenciesMock.crypto,
    ]);

    const params: CurrencyConversionParams = {
      from: Constants.anyString,
      to: Constants.anyCryptoCurrency,
      amount: 10,
    };

    conversionService.convert(params).catch((err) => {
      const expectedResult = (err as ApiException).getResponse();
      expect(expectedResult).toStrictEqual({
        errorCode: EErrorCode.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
        message: `Could not find all the requested currencies. Currencies found: ${Constants.anyCryptoCurrency}`,
        data: {},
      });
    });
  });

  it('convert non fictious currencies', async () => {
    currencyService.findAllBySymbol.mockResolvedValueOnce([
      currenciesMock.crypto,
      currenciesMock.fiat,
    ]);

    conversionClient.convert.mockResolvedValueOnce(
      clientCurrencyConversionResponse(Constants.anyFiatCurrency),
    );

    const params: CurrencyConversionParams = {
      from: Constants.anyCryptoCurrency,
      to: Constants.anyFiatCurrency,
      amount: 10,
    };

    const result = await conversionService.convert(params);
    expect(result).toStrictEqual(
      currencyConversionResponse(Constants.anyFiatCurrency),
    );
    expect(conversionClient.convert).toHaveBeenCalledWith(
      Constants.anyCryptoCurrency,
      [Constants.anyFiatCurrency],
    );
  });

  describe('convert fictious to non fictious', () => {
    it('should convert fictious to USD and from USD to non fictious', async () => {
      mockCurrencyServiceReturnFiatAndFictious();
      conversionClient.convert.mockResolvedValueOnce(usdQuotation);

      const params: CurrencyConversionParams = {
        from: Constants.anyFictiousCurrency,
        to: Constants.anyFiatCurrency,
        amount: 10,
      };

      const expectedQuotation =
        Object.values(usdQuotation.quotation)[0] *
        currenciesMock.fictious.quotationCurrencyToUSD;

      const expectedResult: CurrencyConversionResponse = {
        estimatedUpdate: DateUtil.ignoreTime(Constants.anyDate),
        quotation: JSON.parse(
          `{"${Constants.anyFiatCurrency}": ${expectedQuotation}}`,
        ),
        conversion: MoneyUtil.format(expectedQuotation * params.amount),
      };

      const result = await conversionService.convert(params);
      expect({
        ...result,
        estimatedUpdate: DateUtil.ignoreTime(result.estimatedUpdate),
      }).toStrictEqual(expectedResult);
      expect(conversionClient.convert).toHaveBeenCalledWith(
        Constants.USDCurrency,
        [Constants.anyFiatCurrency],
      );
    });

    it('should throw error if origin currency has no quotation to USD', async () => {
      const params: CurrencyConversionParams = {
        from: Constants.anyFictiousCurrency,
        to: Constants.anyFiatCurrency,
        amount: 10,
      };

      currencyService.findAllBySymbol.mockResolvedValueOnce([
        { ...currenciesMock.fictious, quotationCurrencyToUSD: undefined },
        currenciesMock.fiat,
      ]);

      await expect(conversionService.convert(params)).rejects.toThrow(
        ApiException.inputValidation(
          null,
          `Could not find any quotation to ${Constants.anyFictiousCurrency}`,
        ),
      );
    });
  });

  describe('convert non fictious to fictious', () => {
    it('should convert non fictious to USD and from USD to fictious', async () => {
      mockCurrencyServiceReturnFiatAndFictious();
      conversionClient.convert.mockResolvedValueOnce(usdQuotation);

      const params: CurrencyConversionParams = {
        from: Constants.anyFiatCurrency,
        to: Constants.anyFictiousCurrency,
        amount: 10,
      };

      const expectedQuotation =
        Object.values(usdQuotation.quotation)[0] *
        currenciesMock.fictious.quotationUSDToCurrency;

      const expectedResult: CurrencyConversionResponse = {
        estimatedUpdate: DateUtil.ignoreTime(Constants.anyDate),
        quotation: JSON.parse(
          `{"${Constants.anyFictiousCurrency}": ${expectedQuotation}}`,
        ),
        conversion: MoneyUtil.format(expectedQuotation * params.amount),
      };

      const result = await conversionService.convert(params);
      expect({
        ...result,
        estimatedUpdate: DateUtil.ignoreTime(result.estimatedUpdate),
      }).toStrictEqual(expectedResult);
      expect(conversionClient.convert).toHaveBeenCalledWith(
        Constants.anyFiatCurrency,
        [Constants.USDCurrency],
      );
    });

    it('should throw error if destination currency has no USD quotation', async () => {
      const params: CurrencyConversionParams = {
        from: Constants.anyFiatCurrency,
        to: Constants.anyFictiousCurrency,
        amount: 10,
      };

      currencyService.findAllBySymbol.mockResolvedValueOnce([
        { ...currenciesMock.fictious, quotationUSDToCurrency: undefined },
        currenciesMock.fiat,
      ]);

      await expect(conversionService.convert(params)).rejects.toThrow(
        ApiException.inputValidation(
          null,
          `Could not find any quotation to ${Constants.anyFictiousCurrency}`,
        ),
      );
    });
  });

  describe('convert fictious currencies', () => {
    it('should multiply origin quotation to USD with destination USD quotation', async () => {
      currencyService.findAllBySymbol.mockResolvedValueOnce([
        currenciesMock.fictious,
        currenciesMock.fictious,
      ]);

      const params: CurrencyConversionParams = {
        from: Constants.anyFictiousCurrency,
        to: Constants.anyFictiousCurrency,
        amount: 10,
      };

      const expectedQuotation =
        currenciesMock.fictious.quotationCurrencyToUSD *
        currenciesMock.fictious.quotationUSDToCurrency;

      const expectedResult: CurrencyConversionResponse = {
        estimatedUpdate: DateUtil.ignoreTime(Constants.anyDate),
        quotation: JSON.parse(
          `{"${Constants.anyFictiousCurrency}": ${expectedQuotation}}`,
        ),
        conversion: MoneyUtil.format(expectedQuotation * params.amount),
      };

      const result = await conversionService.convert(params);
      expect({
        ...result,
        estimatedUpdate: DateUtil.ignoreTime(result.estimatedUpdate),
      }).toStrictEqual(expectedResult);
    });

    it('should throw error if origin currency has no quotation to USD', async () => {
      const originCurrency = {
        ...currenciesMock.fictious,
        symbol: 'XXX',
        quotationCurrencyToUSD: undefined,
      };

      const params: CurrencyConversionParams = {
        from: originCurrency.symbol,
        to: Constants.anyFictiousCurrency,
        amount: 10,
      };

      currencyService.findAllBySymbol.mockResolvedValueOnce([
        originCurrency,
        currenciesMock.fictious,
      ]);

      await expect(conversionService.convert(params)).rejects.toThrow(
        ApiException.inputValidation(
          null,
          `Could not find any quotation to ${originCurrency.symbol}`,
        ),
      );
    });

    it('should throw error if destination currency has no USD quotation', async () => {
      const destinationCurrency = {
        ...currenciesMock.fictious,
        symbol: 'XXX',
        quotationUSDToCurrency: undefined,
      };

      const params: CurrencyConversionParams = {
        from: Constants.anyFictiousCurrency,
        to: destinationCurrency.symbol,
        amount: 10,
      };

      currencyService.findAllBySymbol.mockResolvedValueOnce([
        destinationCurrency,
        currenciesMock.fictious,
      ]);

      await expect(conversionService.convert(params)).rejects.toThrow(
        ApiException.inputValidation(
          null,
          `Could not find any quotation to ${destinationCurrency.symbol}`,
        ),
      );
    });
  });
});
