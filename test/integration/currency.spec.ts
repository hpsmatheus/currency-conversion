import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { Model } from 'mongoose';
import CurrencyModule from '../../src/modules/currency/currency.module';
import { CurrencyDocument } from '../../src/schema/currency.schema';
import { Currency } from '../../src/typings/currency/currency.entity';
import supertest from 'supertest';
import AppBuilder from '../mocks/core/app.builder';
import { createCurrencyInputMock } from '../mocks/currency/create-currency.input.mock';
import { EErrorCode } from '../../src/core/error/error-code.enum';

describe('Currency integration tests', () => {
  let app: INestApplication;
  const modelMock = mock<Model<CurrencyDocument>>();

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [CurrencyModule],
    })
      .overrideProvider(getModelToken(Currency.name))
      .useValue(modelMock)
      .compile();

    app = await AppBuilder.build(testingModule);
  });

  describe('Create currency', () => {
    it('should /POST to create new currency', async () => {
      modelMock.findOne.mockResolvedValueOnce(null);
      const result = await supertest(app.getHttpServer())
        .post('/currency')
        .send(createCurrencyInputMock);
      expect(result.status).toBe(HttpStatus.CREATED);
      expect(modelMock.create).toHaveBeenCalledWith(createCurrencyInputMock);
    });

    it('should return 400 to invalid payloads', async () => {
      const result = await supertest(app.getHttpServer()).post('/currency');
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errorCode).toBe(EErrorCode.INPUT_VALIDATION_ERROR);
      expect(result.body.message).toStrictEqual(
        'errors occurred during input validation',
      );
      expect(result.body.data).toStrictEqual({
        errors: [
          'name must be a string',
          'symbol must be a string',
          'type must be a valid enum value',
        ],
      });
    });

    it('should return formatted error object when error happens', async () => {
      modelMock.create.mockImplementation(() => {
        throw new Error('generic error');
      });
      const result = await supertest(app.getHttpServer())
        .post('/currency')
        .send(createCurrencyInputMock);
      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toStrictEqual('generic error');
      expect(result.body.data).toBeDefined();
    });
  });

  describe('Delete currency', () => {
    it('should /DELETE to remove currency', async () => {
      const result = await supertest(app.getHttpServer()).delete(
        '/currency/symbol',
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(modelMock.deleteOne).toHaveBeenCalledWith({ symbol: 'symbol' });
    });

    it('should return formatted error object when error happens', async () => {
      modelMock.deleteOne.mockImplementation(() => {
        throw new Error('generic error');
      });
      const result = await supertest(app.getHttpServer()).delete(
        '/currency/symbol',
      );

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toStrictEqual('generic error');
      expect(result.body.data).toBeDefined();
    });
  });
});
