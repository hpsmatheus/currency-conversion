import { Module } from '@nestjs/common';
import BusinessEntityModule from './modules/business-entity/business-entity.module';

@Module({
  imports: [BusinessEntityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
