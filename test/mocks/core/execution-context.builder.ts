/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import Constants from '../../constants';

export default class ExecutionContextBuilder {
  private executionContext: DeepMocked<ExecutionContext>;

  constructor() {
    this.executionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          body: Constants.anyObject,
          url: Constants.anyString,
          method: Constants.anyString,
          params: Constants.anyString,
          query: Constants.anyObject,
        }),
      }),
    });
  }

  public build(): DeepMocked<ExecutionContext> {
    return this.executionContext;
  }
}
