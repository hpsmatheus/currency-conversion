import { Pool } from 'pg';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class DbService {
  private db;

  constructor() {
    this.db = new Pool({
      user: 'pgsql',
      host: 'localhost',
      database: 'sinai',
      password: 'pgsql',
      port: 5432,
    });
    this.db.connect();
  }

  public async executeQuery(sql: string, params: unknown[]): Promise<[]> {
    const result = await this.db.query(sql, params);
    return result.rows;
  }

  public async executeSum(sql: string, params: string[]): Promise<number> {
    const result = await this.db.query(sql, params);
    return result.rows[0].sum ?? 0;
  }

  public async getSequenceNextValue(sql: string): Promise<number> {
    const result = await this.db.query(sql);
    return result.rows[0].nextval;
  }
}
