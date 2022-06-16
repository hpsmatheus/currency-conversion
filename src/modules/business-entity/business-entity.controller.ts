import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from '../../core/swagger-response';
import CreateBusinessEntityDto from '../../typings/dto/create-business-entity.dto';
import UpdateBusinessEntityDto from '../../typings/dto/update-business-entity.dto';

@ApiTags('Business Entity')
@Controller('business-entity')
export default class BusinessEntityController {
  @Get(':id/emissions/total')
  @ApiResponse(SwaggerResponse.Ok(Number))
  public async getTotalEmissions(@Param('id') id: number): Promise<number> {
    return id;
  }

  @Get(':id/ancestry/names')
  @ApiResponse(SwaggerResponse.Ok([String]))
  public async getAncestryNames(@Param('id') id: number): Promise<string[]> {
    return [`${id}`, `${id}`];
  }

  @Post()
  @ApiResponse(SwaggerResponse.Created(Number))
  public async create(
    @Body() businessEntityDto: CreateBusinessEntityDto,
  ): Promise<number> {
    return businessEntityDto.parentId;
  }

  @Patch(':id')
  @ApiResponse(SwaggerResponse.Created(Number))
  public async update(
    @Param('id') id: number,
    @Body() updateBusinessEntityDto: UpdateBusinessEntityDto,
  ): Promise<number> {
    return updateBusinessEntityDto.emissions;
  }
}
