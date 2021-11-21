import { ComponentClass } from 'react';
import {
  CalendarProps as Props,
  CalendarCustomStyleGenerator as CustomStyleGenerator,
  CalendarExtraInfo as ExtraInfo,
  CalendarMark as Mark,
} from './src/pages/calendar/index';
import { LunarInfo } from './src/pages/calendar/utils';

export declare type CalendarProps = Props;
export declare type CalendarCustomStyleGenerator = CustomStyleGenerator;
export declare type CalendarExtraInfo = ExtraInfo;
export declare type CalendarMark = Mark;

export declare namespace CalendarTools {
  /** 公历转农历
   * @param date 日期字符串 YYYY-MM-DD
   */
  export function solar2lunar(date: string): LunarInfo;
  /** 农历转公历
   * @param y 年
   * @param m 月
   * @param d 日
   * @param isLeapMonth 是否是闰月
   */
  export function lunar2solar(
    y: number,
    m: number,
    d: number,
    isLeapMonth: boolean
  ): LunarInfo;
}

declare const Calendar: ComponentClass<CalendarProps>;

export default Calendar;
