import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import ApiException from './error/api-exception';

export default class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        throw this.handleErrorOnRequest(error);
      }),
    );
  }

  private handleErrorOnRequest(error: unknown): ApiException {
    const exception =
      error instanceof ApiException ? error : ApiException.parseError(error);

    return exception;
  }
}
