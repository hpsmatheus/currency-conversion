import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiException from '../../core/error/api-exception';
import { CurrencyDocument } from 'src/schema/currency.schema';
import CreateCurrencyInput from 'src/typings/currency/create-currency.input.dto';
import { Currency } from '../../typings/currency/currency.entity';

@Injectable()
export default class CurrencyService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,
  ) {}

  async findAll(): Promise<Currency[]> {
    const result = await this.currencyModel.find().exec();
    return result;
  }

  public async create(currencyInput: CreateCurrencyInput): Promise<Currency> {
    const alreadyExists = await this.findOneBySymbol(currencyInput.symbol);
    if (alreadyExists) {
      throw ApiException.inputValidation(null, 'Currency already exists');
    }
    return this.currencyModel.create(currencyInput);
  }

  public async findOneBySymbol(symbol: string): Promise<Currency> {
    return this.currencyModel.findOne({
      symbol,
    });
  }

  public async findAllBySymbol(symbols: string[]): Promise<Currency[]> {
    return this.currencyModel.find({ symbol: { $in: symbols } });
  }

  public async delete(symbol: string): Promise<void> {
    await this.currencyModel.deleteOne({ symbol });
  }
}
