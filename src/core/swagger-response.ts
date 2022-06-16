/* eslint-disable @typescript-eslint/ban-types */
import { HttpStatus, Type } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

function ok(
  type?: Type<unknown> | Function | [Function] | string,
): ApiResponseOptions {
  return {
    status: HttpStatus.OK,
    description: 'success',
    type,
  };
}

function created(
  type?: Type<unknown> | Function | [Function] | string,
): ApiResponseOptions {
  return {
    status: HttpStatus.CREATED,
    description: 'success',
    type,
  };
}

export const SwaggerResponse = {
  Ok: ok,
  Created: created,
};
