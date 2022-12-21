import * as uuid from 'uuid';
import Constants from '../../../constants';
import RequestContextBuilder from '../../../../src/core/request-interceptor/request-context.builder';
import MockRequestContextBuilder from '../../../mocks/core/mock-request-context.builder';
import ExecutionContextBuilder from '../../../mocks/core/execution-context.builder';
jest.mock('uuid');
describe('Request Context Builder', () => {
  beforeEach(() => {
    jest.spyOn(uuid, 'v4').mockReturnValue(Constants.anyUuid);
  });

  it('should build request context', () => {
    const expectedResult = new MockRequestContextBuilder().build();

    const context = new ExecutionContextBuilder().build();
    const result = new RequestContextBuilder(context).build();

    expect(result.stringfiedBody).toStrictEqual(expectedResult.stringfiedBody);
    expect(result.trackId).toStrictEqual(expectedResult.trackId);
    expect(result.metadata).toStrictEqual(expectedResult.metadata);
    expect(result.startTime).toBeDefined();
  });
});
