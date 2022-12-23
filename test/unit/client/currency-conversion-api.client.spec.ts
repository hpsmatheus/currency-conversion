import axios from 'axios';
import Constants from '../../constants';
import { clientCurrencyConversionResponse } from '../../mocks/client/client-currency-conversion.response.mock';
import CurrencyConversionApiClient from '../../../src/client/currency-conversion-api.client';
import { externalApiConversionResponseMock } from '../../mocks/client/external-api-conversion.response.mock';
import DateUtil from '../../../src/core/date.util';
import ClientCurrencyConversionResponse from '../../../src/typings/client/client-currency-conversion.response.dto';

describe('Currency Conversion Api Client', () => {
  const client = new CurrencyConversionApiClient();

  beforeEach(() => {
    process.env.CONVERSION_API_KEY = Constants.anyString;
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce(externalApiConversionResponseMock());
  });

  const convert = (): Promise<ClientCurrencyConversionResponse | null> =>
    client.convert(Constants.anyOriginCurrency, [
      Constants.anyDestinationCurrency,
    ]);

  it('should call external API to execute conversion', async () => {
    const result = await convert();

    expect({
      ...result,
      estimatedUpdate: DateUtil.ignoreTime(result.estimatedUpdate),
    }).toStrictEqual({
      ...clientCurrencyConversionResponse,
      estimatedUpdate: DateUtil.ignoreTime(result.estimatedUpdate),
    });

    expect(axios.get).toHaveBeenCalledWith(
      `https://min-api.cryptocompare.com/data/price`,
      {
        headers: { authorization: `Apikey ${Constants.anyString}` },
        params: {
          fsym: Constants.anyOriginCurrency,
          tsyms: Constants.anyDestinationCurrency,
        },
      },
    );
  });

  it('should return null when api return error', async () => {
    jest.resetAllMocks();
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: { Response: 'Error' } });

    const result = await convert();
    expect(result).toBeNull();
  });
});
