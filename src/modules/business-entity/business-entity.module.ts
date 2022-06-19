import { Module } from '@nestjs/common';
import BusinessEntityController from './business-entity.controller';
import DbModule from '../database/db.module';
import BusinessEntityService from './business-entity.service';

@Module({
  imports: [DbModule],
  controllers: [BusinessEntityController],
  providers: [BusinessEntityService],
})
export default class BusinessEntityModule {}
