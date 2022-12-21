import { Logger } from '@nestjs/common';
import { formatISO } from 'date-fns';
import RequestContext from '../../typings/request-context';
import ApiException from '../error/api-exception';

export default class RequestLogger extends Logger {
  constructor(private readonly reqContext: RequestContext) {
    super();
  }

  public reqStart(): void {
    const req = this.reqContext;
    const startTime = formatISO(req.startTime);
    const log = `[${req.trackId}] Request started at ${startTime} | Input: ${req.stringfiedBody} | Metadata: ${req.metadata}`;
    this.log(log);
  }

  public reqEnd(): void {
    const requestDuration = Date.now() - this.reqContext.startTime;
    const log = `[${this.reqContext.trackId}] Request took ${requestDuration} ms`;
    this.log(log);
  }

  public reqError(error: ApiException): void {
    const requestDuration = Date.now() - this.reqContext.startTime;
    const formattedError = JSON.stringify(error.getResponse());
    const log = `[${this.reqContext.trackId}] Request took ${requestDuration} ms | Error: ${formattedError}`;
    this.error(log);
  }
}
