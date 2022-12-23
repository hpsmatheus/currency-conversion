import * as mongoose from 'mongoose';
import { Currency } from 'src/typings/currency/currency.entity';
export const CurrencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    usdQuotation: { type: Number },
    type: {
      type: String,
      enum: ['FIAT', 'CRYPTO', 'FICTIOUS'],
      required: true,
    },
  },
  {
    timestamps: true,
    virtuals: {
      id: {
        get() {
          return this._id;
        },
      },
    },
  },
);

export type CurrencyDocument = mongoose.HydratedDocument<Currency>;
