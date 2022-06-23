import { Test } from '@nestjs/testing';
import BusinessEntityModule from '../../../src/modules/business-entity/business-entity.module';
import { INestApplication } from '@nestjs/common';
import AppBuilder from '../../mocks/app.builder';
import Constants from '../../constants';
import * as request from 'supertest';

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
    await request(app.getHttpServer()).get(baseURL);
  });
});
