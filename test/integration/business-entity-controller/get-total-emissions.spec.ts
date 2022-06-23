import { Test } from '@nestjs/testing';
import BusinessEntityModule from '../../../src/modules/business-entity/business-entity.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import Constants from '../../constants';
import * as request from 'supertest';
import { EErrorCode } from '../../../src/core/error/error-code.enum';
import AppBuilder from '../../mocks/core/app.builder';

const mockPool = {
  connect: jest.fn(),
  query: jest.fn(),
};
jest.mock('pg', () => {
  return { Pool: jest.fn(() => mockPool) };
});

describe('Get total emissions integration tests', () => {
  let app: INestApplication;
  const baseURL = `/business-entity/${Constants.anyNumber}/emissions/total`;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BusinessEntityModule],
    }).compile();

    app = await AppBuilder.build(moduleRef);
  });

  it('should get total emissions with success', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ sum: Constants.anyNumber }],
    });
    const result = await request(app.getHttpServer()).get(baseURL);
    expect(result.status).toStrictEqual(HttpStatus.OK);
    expect(Number(result.text)).toStrictEqual(Constants.anyNumber);
  });

  it('should return formatted error if it occurs', async () => {
    const databaseUnavailableMessage = 'could not connect to database';
    mockPool.query.mockImplementationOnce(() => {
      throw new Error(databaseUnavailableMessage);
    });
    const result = await request(app.getHttpServer()).get(baseURL);
    expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
    expect(result.body.message).toStrictEqual(databaseUnavailableMessage);
    expect(result.body.data).toBeDefined();
  });
});
