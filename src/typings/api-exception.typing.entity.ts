import { HttpStatus } from '@nestjs/common';

export default class ApiExceptionTyping {
  statusCode: HttpStatus;

  errorCode: string;

  message: string;

  data?: unknown;
}
