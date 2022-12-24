import Constants from '../../constants';

export const externalApiConversionResponseMock = (
  symbol: string = Constants.anyDestinationCurrency,
): Record<string, number> => {
  return {
    data: JSON.parse(`{"${symbol}": ${Constants.anyQuotation}}`),
  };
};
