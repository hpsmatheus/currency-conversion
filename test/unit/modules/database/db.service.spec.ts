import DbService from '../../../../src/modules/database/db.service';
import Constants from '../../../constants';

const mockPool = {
  connect: jest.fn(),
  query: jest.fn(),
};
jest.mock('pg', () => {
  return { Pool: jest.fn(() => mockPool) };
});

const dbService = new DbService();

describe('DbService', () => {
  it('should return the rows of a query result', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [Constants.anyObject] });

    const result = await dbService.executeQuery(Constants.anyString, [
      Constants.anyNumber,
    ]);
    expect(result).toStrictEqual([Constants.anyObject]);
    expect(mockPool.query).toHaveBeenCalledWith(Constants.anyString, [
      Constants.anyNumber,
    ]);
  });

  it('should return the result of a SUM query', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ sum: Constants.anyNumber }],
    });

    const result = await dbService.executeSum(Constants.anyString, [
      Constants.anyNumber,
    ]);
    expect(result).toStrictEqual(Constants.anyNumber);
    expect(mockPool.query).toHaveBeenCalledWith(Constants.anyString, [
      Constants.anyNumber,
    ]);
  });

  it('should return the result of a SUM query', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ sum: Constants.anyNumber }],
    });

    const result = await dbService.executeSum(Constants.anyString, [
      Constants.anyNumber,
    ]);
    expect(result).toStrictEqual(Constants.anyNumber);
    expect(mockPool.query).toHaveBeenCalledWith(Constants.anyString, [
      Constants.anyNumber,
    ]);
  });

  it('should return 0 if the result of a SUM query is null', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ sum: null }],
    });

    const result = await dbService.executeSum(Constants.anyString, [
      Constants.anyNumber,
    ]);
    expect(result).toStrictEqual(0);
    expect(mockPool.query).toHaveBeenCalledWith(Constants.anyString, [
      Constants.anyNumber,
    ]);
  });

  it('should return the next value of a given dbSequence', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ nextval: Constants.anyNumber }],
    });

    const result = await dbService.getSequenceNextValue(Constants.anyString);
    expect(result).toStrictEqual(Constants.anyNumber);
    expect(mockPool.query).toHaveBeenCalledWith(Constants.anyString);
  });
});
