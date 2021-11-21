import React, { FC, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import {
  CalendarDateInfo,
  CustomStyles,
  StyleGeneratorParams
} from "../days/index";
import { CalendarTools, formatDate, LunarInfo } from "../utils";
import { CalendarBadgeItemInfo } from '../index';

const ColorMaps = {
  grey: {
    color: 'rgba(0, 0, 0, 0.85)',
    background: '#fafafa',
    borderColor: '#d9d9d9',
  },

  pink: {
    color: '#c41d7f',
    background: '#fff0f6',
    borderColor: '#ffadd2'
  },
  pinkInverse: {
    color: '#fff',
    background: '#eb2f96',
    borderColor: '#eb2f96',
  },
  magenta: {
    color: '#c41d7f',
    background: '#fff0f6',
    borderColor: '#ffadd2',
  },
  magentaInverse: {
    color: '#fff',
    background: '#eb2f96',
    borderColor: '#eb2f96',
  },
  red: {
    color: '#cf1322',
    background: '#fff1f0',
    borderColor: '#ffa39e',
  },
  redInverse: {
    color: '#fff',
    background: '#f5222d',
    borderColor: '#f5222d',
  },
  volcano: {
    color: '#d4380d',
    background: '#fff1f0',
    borderColor: '#ffa39e',
  },
  volcanoInverse: {
    color: '#fff',
    background: '#fa541c',
    borderColor: '#fa541c'
  },
  orange: {
    color: '#d46b08',
    background: '#fff7e6',
    borderColor: '#ffd591'
  },
  orangeInverse: {
    color: '#fff',
    background: '#fa8c16',
    borderColor: '#fa8c16'
  },
  yellow: {
    color: '#d4b106',
    background: '#feffe6',
    borderColor: '#fffb8f',
  },

  yellowInverse: {
    color: '#fff',
    background: '#fadb14',
    borderColor: '#fadb14'
  },

  gold: {
    color: '#d48806',
    background: '#fffbe6',
    borderColor: '#ffe58f'
  },

  goldInverse: {
    color: '#fff',
    background: '#faad14',
    borderColor: '#faad14'
  },

  cyan: {
    color: '#08979c',
    background: '#e6fffb',
    borderColor: '#87e8de'
  },

  cyanInverse: {
    color: '#fff',
    background: '#13c2c2',
    borderColor: '#13c2c2'
  },

  lime: {
    color: '#7cb305',
    background: '#fcffe6',
    borderColor: '#eaff8f'
  },

  limeInverse: {
    color: '#fff',
    background: '#a0d911',
    borderColor: '#a0d911'
  },

  green: {
    color: '#389e0d',
    background: '#f6ffed',
    borderColor: '#b7eb8f'
  },

  greenInverse: {
    color: '#fff',
    background: '#52c41a',
    borderColor: '#52c41a'
  },

  blue: {
    color: '#096dd9',
    background: '#e6f7ff',
    borderColor: '#91d5ff'
  },

  blueInverse: {
    color: '#fff',
    background: '#1890ff',
    borderColor: '#1890ff'
  },

  geekblue: {
    color: '#1d39c4',
    background: '#f0f5ff',
    borderColor: '#adc6ff'
  },

  geekblueInverse: {
    color: '#fff',
    background: '#2f54eb',
    borderColor: '#2f54eb'
  },

  purple: {
    color: '#531dab',
    background: '#f9f0ff',
    borderColor: '#d3adf7'
  },

  purpleInverse: {
    color: '#fff',
    background: '#722ed1',
    borderColor: '#722ed1'
  },

  success: {
    color: '#52c41a',
    background: '#f6ffed',
    borderColor: '#b7eb8f',
  },

  error: {
    color: '#ff4d4f',
    background: '#fff2f0',
    borderColor: '#ffccc7',
  },

  warning: {
    color: '#faad14',
    background: '#fffbe6',
    borderColor: '#ffe58f',
  },

  info: {
    color: '#1890ff',
    background: '#e6f7ff',
    borderColor: '#91d5ff',
  },
}
const ColorMapsLength = Object.keys(ColorMaps).length;
const ColorMapsList = Object.keys(ColorMaps).map((key) => ({ key, ...ColorMaps[key] }));

interface IProps {
  onDayLongPress?: ({ value }: { value: string }) => void;
  /**
   * 是否被选中
   */
  selected: boolean;
  /** 点击事件回调 */
  onClick: (info: CalendarDateInfo) => any;
  value: CalendarDateInfo;
  /** 显示模式 普通/农历 */
  mode: 'normal' | 'lunar';
  /** 是否范围选择模式并且endDateStr不为空 **/
  isMultiSelectAndFinish: boolean;
  /**
   * 当前日期是否有mark，没有为-1
   */
  markIndex: number;
  /**
   * 当前日期是否有extraInfo，没有为-1
   */
  extraInfoIndex: number;
  /**
   * 当前日期是否有badgeInfo，没有为-1
   */
  badgeInfoIndex: number;
  /** 是否显示分割线 */
  showDivider: boolean;
  /** 最小的可选时间 */
  minDate: string;
  /** 最大的可选时间 */
  maxDate?: string | undefined;
  /** 自定义样式生成器 */
  customStyleGenerator?: (dateInfo: StyleGeneratorParams) => CustomStyles;
  /** 选定时的背景色 */
  selectedDateColor?: string;
  /**
   * mark的背景色
   */
  markColor: string | undefined;
  markSize: string | undefined;
  /**
   * extraInfo的color
   */
  extraInfoColor: string | undefined;
  /**
   * extraInfo的fontSize
   */
  extraInfoSize: string | undefined;
  /**
   * extraInfo的文本
   */
  extraInfoText: string | undefined;
  /**
  * badgeInfo的列表
  */
  badgeItemList: CalendarBadgeItemInfo[] | undefined;
  /**
   * 被选择（范围选择）
   */
  isInRange: boolean;
  /**
   * 范围起点
   */
  rangeStart: boolean;
  /**
   * 范围终点
   */
  rangeEnd: boolean;
  /** 禁用(不在minDate和maxDate的时间范围内的日期) */
  disable: boolean;
}

const Day: FC<IProps> = (args) => {
  const {
    selected, onDayLongPress, onClick, value, mode, markIndex,
    extraInfoIndex, badgeInfoIndex, customStyleGenerator, disable,
    isInRange, rangeStart, rangeEnd, isMultiSelectAndFinish,
    selectedDateColor, markColor, markSize, extraInfoColor, extraInfoSize,
    extraInfoText, badgeItemList, showDivider,
  } = args;
  const [className, setClassName] = useState<Set<string>>(new Set());
  const [customStyles, setCustomStyles] = useState<CustomStyles>({});

  useEffect(() => {
    let set = new Set<string>();
    const today = formatDate(new Date(), 'day');

    if (!value.currentMonth || disable) {
      // 非本月
      set.add('not-this-month');
    }
    if (selected && !isMultiSelectAndFinish) {
      // 选中
      // 范围选择模式显示已选范围时，不显示selected
      set.add('calendar-selected');
    }
    if (markIndex !== -1) {
      // 标记
      set.add('calendar-marked');
    }
    if (extraInfoIndex !== -1) {
      // 额外信息
      set.add('calendar-extra-info');
    }
    if (badgeInfoIndex !== -1) {
      // 额外信息
      set.add('calendar-badge-info');
    }
    if (value.fullDateStr === today) {
      // 当天
      set.add('calendar-today');
    }
    if (showDivider) {
      // 分割线
      set.add('calendar-line-divider');
    }

    if (isInRange) {
      set.add('calendar-range');
    }

    if (rangeStart) {
      set.add('calendar-range-start');
    }

    if (rangeEnd) {
      set.add('calendar-range-end');
    }

    setClassName(set);
  }, [disable, extraInfoIndex, badgeInfoIndex, isMultiSelectAndFinish, markIndex, selected,
    showDivider, value.currentMonth, value.fullDateStr, isInRange, rangeStart, rangeEnd]);

  useEffect(() => {
    let lunarDayInfo =
      mode === 'lunar'
        ? CalendarTools.solar2lunar(value.fullDateStr)
        : null;
    if (customStyleGenerator) {
      // 用户定制样式
      const generatorParams: StyleGeneratorParams = {
        ...value,
        lunar: lunarDayInfo,
        selected: selected,
        multiSelect: {
          multiSelected: isInRange,
          multiSelectedStar: rangeStart,
          multiSelectedEnd: rangeEnd
        },
        marked: markIndex !== -1,
        hasExtraInfo: extraInfoIndex !== -1,
        hasBadgeInfo: badgeInfoIndex !== -1,
      };
      setCustomStyles(customStyleGenerator(generatorParams))
    }
  }, [selected, value, markIndex, extraInfoIndex, badgeInfoIndex, customStyleGenerator, isInRange, rangeStart, rangeEnd, mode]);


  let lunarDayInfo =
    mode === 'lunar'
      ? CalendarTools.solar2lunar(value.fullDateStr)
      : null;
  let lunarClassName = ['lunar-day'];
  if (lunarDayInfo) {
    if (lunarDayInfo.IDayCn === '初一') {
      lunarClassName.push('lunar-month');
    }
  }
  return (
    <View
      onLongPress={
        onDayLongPress
          ? () => onDayLongPress({ value: value.fullDateStr })
          : undefined
      }
      className={Array.from(className).join(' ')}
      onClick={() => {
        if (!disable) {
          onClick(value);
        }
      }}
      style={customStyles.containerStyle}
    >
      <View

        className='calendar-date'
        style={
          customStyles.dateStyle || customStyles.dateStyle === {}
            ? customStyles.dateStyle
            : {
              backgroundColor:
                selected || isInRange
                  ? selectedDateColor
                  : ''
            }
        }
      >
        {/* 日期 */}
        {value.date}
      </View>
      {mode !== 'normal' && (
        <View className={lunarClassName.join(' ')} style={customStyles.lunarStyle}>
          {/* 农历 */}
          {(() => {
            if (!lunarDayInfo) {
              return;
            }
            lunarDayInfo = lunarDayInfo as LunarInfo;
            let dateStr: string;
            if (lunarDayInfo.IDayCn === '初一') {
              dateStr = lunarDayInfo.IMonthCn;
            } else {
              //@ts-ignore
              dateStr = lunarDayInfo.isTerm
                ? lunarDayInfo.Term
                : lunarDayInfo.IDayCn;
            }
            return dateStr;
          })()}
        </View>
      )}
      {/* 标记 */}
      <View
        className='calendar-mark'
        style={{
          backgroundColor: markIndex === -1 ? '' : markColor,
          height: markIndex === -1 ? '' : markSize,
          width: markIndex === -1 ? '' : markSize,
          top: mode === 'lunar' ? '2.0rem' : '1.5rem',
          ...customStyles.markStyle
        }}
      />
      {/* 额外信息 */}
      {extraInfoIndex !== -1 && (
        <View
          className='calendar-extra-info'
          style={{
            color: extraInfoIndex === -1 ? '' : extraInfoColor,
            fontSize: extraInfoIndex === -1 ? '' : extraInfoSize,
            ...customStyles.extraInfoStyle
          }}
        >
          {extraInfoText}
        </View>
      )}
      {badgeInfoIndex !== -1 && badgeItemList && badgeItemList.length && (
        <View className='calendar-badge-info' style={customStyles.badgeInfoStyle}>
          {badgeItemList.map(({ text, color, style }, index) => {
            const theme = color && ColorMaps[color] ? ColorMaps[color] : ColorMapsList[index % ColorMapsLength];
            return (
              <View
                key={text}
                className='calendar-badge-item'
                style={{
                  color: theme.color,
                  background: theme.background,
                  borderColor: theme.borderColor,
                  ...style,
                }}
              >
                {text}
              </View>
            )
          })}
        </View>
      )}
    </View>
  );
}

export default React.memo(Day);
