import { parseJSON, min } from 'date-fns';

export default class DateUtil {
  public static now(): Date {
    return parseJSON(Date.now());
  }

  public static min(dates: Date[]): Date {
    return min(dates);
  }
}
