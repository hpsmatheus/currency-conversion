import ClientCurrencyConversionResponse from '../../../src/typings/client/client-currency-conversion.response.dto';
import Constants from '../../constants';

export const clientCurrencyConversionResponse = (
  symbol: string = Constants.anyDestinationCurrency,
): ClientCurrencyConversionResponse => {
  return {
    estimatedUpdate: Constants.anyDate,
    quotation: JSON.parse(`{"${symbol}": ${Constants.anyQuotation}}`),
  };
};
