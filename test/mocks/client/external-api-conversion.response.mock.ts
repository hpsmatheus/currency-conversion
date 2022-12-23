import Constants from '../../constants';

export const externalApiConversionResponseMock = (): Record<string, number> => {
  return {
    data: JSON.parse(
      `{"${Constants.anyDestinationCurrency}": ${Constants.anyNumber}}`,
    ),
  };
};
