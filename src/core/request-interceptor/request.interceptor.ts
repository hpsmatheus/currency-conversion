import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import RequestLogger from './logger';
import RequestContextBuilder from './request-context.builder';
import ApiException from '../error/api-exception';

export default class RequestInterceptor implements NestInterceptor {
  private logger: RequestLogger;

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const reqContextBuilder = new RequestContextBuilder(context);
    const reqContext = reqContextBuilder.build();
    this.logger = new RequestLogger(reqContext);

    this.handleStartRequest();

    return next.handle().pipe(
      tap(() => this.handleEndRequest()),

      catchError((error) => {
        throw this.handleErrorOnRequest(error);
      }),
    );
  }

  private handleStartRequest(): void {
    this.logger.reqStart();
  }

  private handleEndRequest(): void {
    this.logger.reqEnd();
  }

  private handleErrorOnRequest(error: unknown): ApiException {
    const exception =
      error instanceof ApiException ? error : ApiException.parseError(error);
    this.logger.reqError(exception);
    return exception;
  }
}
