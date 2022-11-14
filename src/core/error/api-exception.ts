import { HttpException, HttpStatus } from '@nestjs/common';
import ApiExceptionTyping from '../../typings/api-exception.typing.entity';
import { EErrorCode } from './error-code.enum';

export default class ApiException extends HttpException {
  constructor(error: ApiExceptionTyping) {
    super(error, error.statusCode);
  }

  static inputValidation(data?: unknown | never): ApiException {
    return new ApiException({
      errorCode: EErrorCode.INPUT_VALIDATION_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'errors occurred during input validation',
      data: data ?? {},
    });
  }

  public static parseError(error: any): ApiException {
    return new ApiException({
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
