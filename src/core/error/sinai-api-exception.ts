import { HttpException, HttpStatus } from '@nestjs/common';
import SinaiApiExceptionTyping from '../../typings/sinai-api-exception.typing.entity';
import { EErrorCode } from './error-code.enum';

export default class SinaiApiException extends HttpException {
  constructor(error: SinaiApiExceptionTyping) {
    super(error, error.statusCode);
  }

  static inputValidation(data?: unknown | never): SinaiApiException {
    return new SinaiApiException({
      errorCode: EErrorCode.INPUT_VALIDATION_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'errors occurred during input validation',
      data: data ?? {},
    });
  }

  public static parseError(error: any): SinaiApiException {
    return new SinaiApiException({
      statusCode: this.getStatusCodeFrom(error),
      errorCode: EErrorCode.INTERNAL_SERVER_ERROR,
      message: this.getMessageFrom(error),
      data: this.getDataFrom(error),
    });
  }

  private static getStatusCodeFrom(error: any): HttpStatus {
    return error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private static getMessageFrom(error: any): string {
    return error.response?.message ?? error.message ?? 'Unknown error';
  }

  private static getDataFrom(error: any): any {
    return { stack: error.stack } ?? {};
  }
}
