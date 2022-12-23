import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencySchema } from 'src/schema/currency.schema';
import { Currency } from 'src/typings/currency/currency.entity';
import CurrencyController from './currency.controller';
import CurrencyService from './currency.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
    ]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export default class CurrencyModule {}
