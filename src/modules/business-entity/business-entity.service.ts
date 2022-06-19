import DbService from '../database/db.service';
import { Injectable } from '@nestjs/common';
import { Query } from '../../querys/busines-entity.query';
import CreateBusinessEntityDto from '../../typings/dto/create-business-entity.dto';

@Injectable()
export default class BusinessEntityService {
  constructor(private readonly dbService: DbService) {}

  public async getTotalEmissions(id: number): Promise<number> {
    return this.dbService.executeSum(Query.getTotalEmissions, [`${id}`]);
  }

  public async create(
    businessEntity: CreateBusinessEntityDto,
  ): Promise<number> {
    const newId = await this.dbService.getSequenceNextValue(
      Query.getSequenceNextValue,
    );
    await this.dbService.executeQuery(Query.create, [
      newId,
      `${businessEntity.name}`,
      `${businessEntity.parentId}`,
      newId,
      `${businessEntity.emissions}`,
    ]);
    return newId;
  }
}
