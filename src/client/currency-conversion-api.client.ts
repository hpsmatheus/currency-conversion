import axios from 'axios';
import { parseJSON } from 'date-fns';
import { Injectable } from '@nestjs/common';
import ClientCurrencyConversionResponse from 'src/typings/client/client-currency-conversion.response.dto';

@Injectable()
export default class CurrencyConversionApiClient {
  private get url(): string {
    return 'https://min-api.cryptocompare.com/data';
  }

  private get authorization(): string {
    return `Apikey ${process.env.CONVERSION_API_KEY}`;
  }

  public async convert(
    from: string,
    to: string[],
  ): Promise<ClientCurrencyConversionResponse> {
    const response = (await axios.get(`${this.url}/price`, {
      headers: { authorization: this.authorization },
      params: {
        fsym: from,
        tsyms: to.join(','),
      },
    })) as {
      data: Record<string, number>;
    };
    return {
      quotation: response.data,
      estimatedUpdate: parseJSON(Date.now()),
    };
  }
}