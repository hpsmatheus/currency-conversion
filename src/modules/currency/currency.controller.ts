import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from '../../core/swagger-response';
import CreateCurrencyInput from '../../typings/currency/create-currency.input.dto';
import { Currency } from '../../typings/currency/currency.entity';
import CurrencyService from './currency.service';

@Controller('currency')
@ApiTags('Currency')
export default class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiResponse(SwaggerResponse.Ok([Currency]))
  @ApiResponse(SwaggerResponse.InternalError)
  async findAll(): Promise<Currency[]> {
    return this.currencyService.findAll();
  }

  @Post()
  @ApiResponse(SwaggerResponse.Created(Currency))
  @ApiResponse(SwaggerResponse.InternalError)
  @ApiResponse(SwaggerResponse.InputValidationError)
  async create(@Body() currencyInput: CreateCurrencyInput): Promise<Currency> {
    return this.currencyService.create(currencyInput);
  }

  @Delete(':symbol')
  @ApiResponse(SwaggerResponse.Ok())
  public async delete(@Param('symbol') symbol: string): Promise<void> {
    return this.currencyService.delete(symbol);
  }
}
