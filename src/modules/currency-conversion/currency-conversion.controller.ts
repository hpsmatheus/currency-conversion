import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/core/swagger-response';
import CurrencyConversionParams from 'src/typings/currency-conversion/currency-conversion.params.dto';
import CurrencyConversionResponse from 'src/typings/currency-conversion/currency-conversion.response.dto';
import CurrencyConversionService from './currency-conversion.service';

@Controller('currency-conversion')
@ApiTags('Currency Conversion')
export default class CurrencyConversionController {
  constructor(
    private readonly currencyConversionService: CurrencyConversionService,
  ) {}

  @Get()
  @ApiResponse(SwaggerResponse.Ok(CurrencyConversionResponse))
  @ApiResponse(SwaggerResponse.InternalError)
  @ApiResponse(SwaggerResponse.InputValidationError)
  public async convert(
    @Query() params: CurrencyConversionParams,
  ): Promise<CurrencyConversionResponse> {
    return this.currencyConversionService.convert(params);
  }
}
