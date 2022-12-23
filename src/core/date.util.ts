import { parseJSON, min, getDate, getMonth, getYear } from 'date-fns';

export default class DateUtil {
  public static now(): Date {
    return parseJSON(Date.now());
  }

  public static min(dates: Date[]): Date {
    return min(dates);
  }

  public static ignoreTime(date: Date): Date {
    const day = getDate(date);
    const month = getMonth(date);
    const year = getYear(date);
    return new Date(year, month, day, 0, 0, 0, 0);
  }
}
