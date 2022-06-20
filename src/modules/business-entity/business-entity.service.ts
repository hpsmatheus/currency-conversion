import DbService from '../database/db.service';
import { Injectable } from '@nestjs/common';
import { Querys } from '../../querys/busines-entity.query';
import CreateBusinessEntityDto from '../../typings/dto/create-business-entity.dto';
import UpdateBusinessEntityDto from '../../typings/dto/update-business-entity.dto';

@Injectable()
export default class BusinessEntityService {
  constructor(private readonly dbService: DbService) {}

  public async getTotalEmissions(id: number): Promise<number> {
    return this.dbService.executeSum(Querys.getTotalEmissions, [`${id}`]);
  }

  public async getAncestryNames(id: number): Promise<string[]> {
    const rows = await this.dbService.executeQuery(Querys.getAncestryNames, [
      id,
    ]);
    return this.buildAncestryNamesArrayFromDbRows(rows);
  }

  private buildAncestryNamesArrayFromDbRows(rows: []): string[] {
    return rows.map((item) =>
      Object.values(item).reduce((value) => value),
    ) as string[];
  }

  public async update(
    id: number,
    updateBusinessEntityDto: UpdateBusinessEntityDto,
  ): Promise<number> {
    await this.dbService.executeQuery(Querys.update, [
      updateBusinessEntityDto.emissions,
      id,
    ]);
    return id;
  }

  public async create(
    businessEntity: CreateBusinessEntityDto,
  ): Promise<number> {
    const newId = await this.getSequenceNextValue();
    await this.dbService.executeQuery(Querys.create, [
      newId,
      `${businessEntity.name}`,
      `${businessEntity.parentId}`,
      newId,
      `${businessEntity.emissions}`,
    ]);
    return newId;
  }

  private getSequenceNextValue(): Promise<number> {
    return this.dbService.getSequenceNextValue(Querys.getSequenceNextValue);
  }
}
