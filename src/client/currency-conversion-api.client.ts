import axios from 'axios';
import { Injectable } from '@nestjs/common';
import ClientCurrencyConversionResponse from 'src/typings/client/client-currency-conversion.response.dto';
import DateUtil from '../core/date.util';

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
  ): Promise<ClientCurrencyConversionResponse | null> {
    const response = (await axios.get(`${this.url}/price`, {
      headers: { authorization: this.authorization },
      params: {
        fsym: from,
        tsyms: to.join(','),
      },
    })) as {
      data: Record<string, number>;
    };

    if (response.data.Response?.toString().includes('Error')) {
      return null;
    }

    return {
      quotation: response.data,
      estimatedUpdate: DateUtil.now(),
    };
  }
}
