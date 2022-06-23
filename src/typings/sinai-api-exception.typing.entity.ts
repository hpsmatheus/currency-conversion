import { HttpStatus } from '@nestjs/common';

export default class SinaiApiExceptionTyping {
  statusCode: HttpStatus;

  errorCode: string;

  message: string;

  data?: unknown;
}
