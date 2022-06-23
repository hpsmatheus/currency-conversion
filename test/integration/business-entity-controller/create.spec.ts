import { HttpStatus, INestApplication } from '@nestjs/common';
import Constants from '../../constants';
import { Test } from '@nestjs/testing';
import BusinessEntityModule from '../../../src/modules/business-entity/business-entity.module';
import * as request from 'supertest';
import CreateBusinessEntityDtoBuilder from '../../mocks/create-business-entity.dto.builder';
import { EErrorCode } from '../../../src/core/error/error-code.enum';
import CreateBusinessEntityDto from '../../../src/typings/dto/create-business-entity.dto';
import AppBuilder from '../../mocks/core/app.builder';

const mockPool = {
  connect: jest.fn(),
  query: jest.fn(),
};
jest.mock('pg', () => {
  return { Pool: jest.fn(() => mockPool) };
});
describe('Create Business Entity integration tests', () => {
  let app: INestApplication;
  const baseURL = `/business-entity`;
  let body: CreateBusinessEntityDto;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BusinessEntityModule],
    }).compile();

    app = await AppBuilder.build(moduleRef);
    body = new CreateBusinessEntityDtoBuilder().build();
  });

  it('should create new business entity with success', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ nextval: Constants.anyNumber }],
    });
    mockPool.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await request(app.getHttpServer()).post(baseURL).send(body);
    expect(result.status).toStrictEqual(HttpStatus.CREATED);
    expect(Number(result.text)).toStrictEqual(Constants.anyNumber);
  });

  it('should return 422 error if DTO is invalid', async () => {
    const result = await request(app.getHttpServer()).post(baseURL);
    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body.errorCode).toBe(EErrorCode.INPUT_VALIDATION_ERROR);
    expect(result.body.message).toStrictEqual(
      'errors occurred during input validation',
    );
    expect(result.body.data).toStrictEqual({
      errors: [
        'name must be a string',
        'parentId must be a number conforming to the specified constraints',
      ],
    });
  });

  it('should return formatted error if it occurs', async () => {
    const databaseUnavailableMessage = 'could not connect to database';
    mockPool.query.mockImplementationOnce(() => {
      throw new Error(databaseUnavailableMessage);
    });
    const result = await request(app.getHttpServer()).post(baseURL).send(body);
    expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
    expect(result.body.message).toStrictEqual(databaseUnavailableMessage);
    expect(result.body.data).toBeDefined();
  });
});
