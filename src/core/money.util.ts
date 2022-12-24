export default class MoneyUtil {
  public static format(value: number): number {
    const decimalPlaces = 2;
    return Number(value.toFixed(decimalPlaces));
  }
}
