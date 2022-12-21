import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import RequestInterceptor from '../../../src/core/request-interceptor/request.interceptor';
import ApiValidationPipe from '../../../src/core/api-validation-pipe';

export default class AppBuilder {
  public static async build(
    moduleRef: TestingModule,
  ): Promise<INestApplication> {
    const app = moduleRef
      .createNestApplication()
      .useGlobalInterceptors(new RequestInterceptor())
      .useGlobalPipes(new ApiValidationPipe());
    await app.init();
    return app;
  }
}
