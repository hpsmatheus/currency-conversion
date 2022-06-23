import { ValidationError, ValidationPipe } from '@nestjs/common';
import SinaiApiException from './error/sinai-api-exception';

export default class SinaiApiValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors = validationErrors.map((error) =>
          Object.values(error.constraints).reduce((value) => value),
        );
        throw SinaiApiException.inputValidation({ errors });
      },
    });
  }
}
