import ClientCurrencyConversionResponse from '../../../src/typings/client/client-currency-conversion.response.dto';
import Constants from '../../constants';

export const clientCurrencyConversionResponse: ClientCurrencyConversionResponse =
  {
    estimatedUpdate: Constants.anyDate,
    quotation: JSON.parse(
      `{"${Constants.anyDestinationCurrency}": ${Constants.anyNumber}}`,
    ),
  };
