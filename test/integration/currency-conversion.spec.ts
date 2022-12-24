import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import axios from 'axios';
import { mock } from 'jest-mock-extended';
import { Model } from 'mongoose';
import CurrencyConversionModule from '../../src/modules/currency-conversion/currency-conversion.module';
import { CurrencyDocument } from '../../src/schema/currency.schema';
import CurrencyConversionParams from '../../src/typings/currency-conversion/currency-conversion.params.dto';
import { Currency } from '../../src/typings/currency/currency.entity';
import supertest from 'supertest';
import Constants from '../constants';
import { externalApiConversionResponseMock } from '../mocks/client/external-api-conversion.response.mock';
import { currenciesMock } from '../mocks/currency.entity.mock';
import AppBuilder from '../mocks/core/app.builder';
import { currencyConversionResponse } from '../mocks/currency-conversion/currency-conversion.response.mock';
import CurrencyConversionResponse from '../../src/typings/currency-conversion/currency-conversion.response.dto';
import DateUtil from '../../src/core/date.util';

describe('Currency Conversion Integration Tests', () => {
  let app: INestApplication;
  const modelMock = mock<Model<CurrencyDocument>>();

  const params: CurrencyConversionParams = {
    from: Constants.anyCryptoCurrency,
    to: Constants.anyFiatCurrency,
    amount: 10,
  };

  beforeAll(async () => {
    process.env.CONVERSION_API_KEY = Constants.anyString;
    const testingModule = await Test.createTestingModule({
      imports: [CurrencyConversionModule],
    })
      .overrideProvider(getModelToken(Currency.name))
      .useValue(modelMock)
      .compile();

    app = await AppBuilder.build(testingModule);

    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce(
        externalApiConversionResponseMock(Constants.anyFiatCurrency),
      );
  });

  it('should /GET to convert with success', async () => {
    modelMock.find.mockResolvedValueOnce([
      currenciesMock.crypto,
      currenciesMock.fiat,
    ]);

    const expectedResult = currencyConversionResponse(
      Constants.anyFiatCurrency,
    );

    const result = await supertest(app.getHttpServer())
      .get('/currency-conversion')
      .query(params);
    const body = result.body as CurrencyConversionResponse;

    expect(result.status).toBe(HttpStatus.OK);

    expect({
      ...body,
      estimatedUpdate: DateUtil.ignoreTime(new Date(body.estimatedUpdate)),
    }).toStrictEqual({
      ...expectedResult,
      estimatedUpdate: DateUtil.ignoreTime(expectedResult.estimatedUpdate),
    });

    expect(axios.get).toHaveBeenCalledWith(
      `https://min-api.cryptocompare.com/data/price`,
      {
        headers: { authorization: `Apikey ${Constants.anyString}` },
        params: {
          fsym: Constants.anyCryptoCurrency,
          tsyms: Constants.anyFiatCurrency,
        },
      },
    );
  });
});
