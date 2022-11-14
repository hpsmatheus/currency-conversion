import RequestLogger from '../../../../src/core/request-interceptor/logger';
import RequestContext from '../../../../src/typings/request-context';
import { Logger } from '@nestjs/common';
import { formatISO } from 'date-fns';
import ApiException from '../../../../src/core/error/api-exception';
import MockRequestContextBuilder from '../../../mocks/core/mock-request-context.builder';

describe('Request logger', () => {
  let requestLogger: RequestLogger;
  let logInfo: jest.SpyInstance;
  let logError: jest.SpyInstance;
  let reqContext: RequestContext;
  beforeEach(() => {
    jest.resetAllMocks();
    reqContext = new MockRequestContextBuilder().build();
    requestLogger = new RequestLogger(reqContext);
    logInfo = jest.spyOn(Logger.prototype, 'log');
    logError = jest.spyOn(Logger.prototype, 'error');
  });

  it('should log req info when starting', () => {
    requestLogger.reqStart();
    const log = logInfo.mock.calls[0][0];
    expect(log).toContain(reqContext.trackId);
    expect(log).toContain(formatISO(reqContext.startTime));
    expect(log).toContain(reqContext.stringfiedBody);
    expect(log).toContain(reqContext.metadata);
    expect(logInfo).toHaveBeenCalledTimes(1);
  });

  it('should log req info when finishing', () => {
    requestLogger.reqEnd();

    const log = logInfo.mock.calls[0][0];
    const msgContainsReqDuration = /\d/.test(log.split(reqContext.trackId)[1]);

    expect(log).toContain(reqContext.trackId);
    expect(msgContainsReqDuration).toBeTruthy();
    expect(log).toContain('ms');
    expect(logInfo).toHaveBeenCalledTimes(1);
  });

  it('should log req info when finishing with error', () => {
    const exception = ApiException.inputValidation();
    const formattedError = JSON.stringify(exception.getResponse());

    requestLogger.reqError(exception);

    const log = logError.mock.calls[0][0];
    const msgContainsReqDuration = /\d/.test(log.split(reqContext.trackId)[1]);

    expect(log).toContain(reqContext.trackId);
    expect(msgContainsReqDuration).toBeTruthy();
    expect(log).toContain('ms');
    expect(log).toContain(formattedError);
    expect(logError).toHaveBeenCalledTimes(1);
  });
});
