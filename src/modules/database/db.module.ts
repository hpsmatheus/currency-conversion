import { Module } from '@nestjs/common';
import DbService from './db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DbService],
  exports: [DbService],
})
export default class DbModule {}
