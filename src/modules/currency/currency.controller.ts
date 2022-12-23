import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import CreateCurrencyInput from 'src/typings/currency/create-currency.input.dto';
import { Currency } from 'src/typings/currency/currency.entity';
import CurrencyService from './currency.service';

@Controller('currency')
@ApiTags('Currency')
export default class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findAll(): Promise<Currency[]> {
    return this.currencyService.findAll();
  }

  @Post()
  async create(@Body() currencyInput: CreateCurrencyInput): Promise<Currency> {
    return this.currencyService.create(currencyInput);
  }
}
