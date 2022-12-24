import CurrencyConversionResponse from '../../../src/typings/currency-conversion/currency-conversion.response.dto';
import Constants from '../../constants';

export const currencyConversionResponse = (
  symbol: string = Constants.anyDestinationCurrency,
): CurrencyConversionResponse => {
  return {
    estimatedUpdate: Constants.anyDate,
    quotation: JSON.parse(`{"${symbol}": ${Constants.anyQuotation}}`),
    conversion: Constants.anyAmout * Constants.anyQuotation,
  };
};
