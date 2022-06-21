import { Module } from '@nestjs/common';
import BusinessEntityModule from './modules/business-entity/business-entity.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), BusinessEntityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
