import { Module } from '@nestjs/common';
import BusinessEntityController from './business-entity.controller';

@Module({
  imports: [],
  controllers: [BusinessEntityController],
  providers: [],
})
export default class BusinessEntityModule {}
