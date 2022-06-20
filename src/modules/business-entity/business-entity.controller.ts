import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from '../../core/swagger-response';
import CreateBusinessEntityDto from '../../typings/dto/create-business-entity.dto';
import UpdateBusinessEntityDto from '../../typings/dto/update-business-entity.dto';
import BusinessEntityService from './business-entity.service';

@ApiTags('Business Entity')
@Controller('business-entity')
export default class BusinessEntityController {
  constructor(private readonly businessEntityService: BusinessEntityService) {}

  @Get(':id/emissions/total')
  @ApiResponse(SwaggerResponse.Ok(Number))
  @ApiResponse(SwaggerResponse.InternalError)
  public async getTotalEmissions(@Param('id') id: number): Promise<number> {
    return this.businessEntityService.getTotalEmissions(id);
  }

  @Get(':id/ancestry/names')
  @ApiResponse(SwaggerResponse.Ok([String]))
  @ApiResponse(SwaggerResponse.InternalError)
  public async getAncestryNames(@Param('id') id: number): Promise<string[]> {
    return this.businessEntityService.getAncestryNames(id);
  }

  @Post()
  @ApiResponse(SwaggerResponse.Created(Number))
  @ApiResponse(SwaggerResponse.InputValidationError)
  @ApiResponse(SwaggerResponse.InternalError)
  public async create(
    @Body() businessEntityDto: CreateBusinessEntityDto,
  ): Promise<number> {
    return this.businessEntityService.create(businessEntityDto);
  }

  @Patch(':id')
  @ApiResponse(SwaggerResponse.Ok(Number))
  @ApiResponse(SwaggerResponse.InputValidationError)
  @ApiResponse(SwaggerResponse.InternalError)
  public async update(
    @Param('id') id: number,
    @Body() updateBusinessEntityDto: UpdateBusinessEntityDto,
  ): Promise<number> {
    return this.businessEntityService.update(id, updateBusinessEntityDto);
  }
}
