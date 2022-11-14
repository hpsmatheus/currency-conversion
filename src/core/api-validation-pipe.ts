import { ValidationError, ValidationPipe } from '@nestjs/common';
import ApiException from './error/api-exception';

export default class ApiValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors = validationErrors.map((error) =>
          Object.values(error.constraints).reduce((value) => value),
        );
        throw ApiException.inputValidation({ errors });
      },
    });
  }
}
