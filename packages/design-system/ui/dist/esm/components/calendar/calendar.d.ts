import * as React from "react";
import { type DayPickerRangeProps, type DayPickerSingleProps } from "react-day-picker";
type OmitKeys<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};
type KeysToOmit = "showWeekNumber" | "captionLayout" | "mode";
type SingleProps = OmitKeys<DayPickerSingleProps, KeysToOmit>;
type RangeProps = OmitKeys<DayPickerRangeProps, KeysToOmit>;
/**
 * @interface
 */
type CalendarProps = ({
    mode: "single";
} & SingleProps) | ({
    mode?: undefined;
} & SingleProps) | ({
    mode: "range";
} & RangeProps);
/**
 * This component is based on the [react-date-picker](https://www.npmjs.com/package/react-date-picker) package.
 *
 * @excludeExternal
 */
declare const Calendar: {
    ({ className, classNames, mode, showOutsideDays, locale, ...props }: CalendarProps): React.JSX.Element;
    displayName: string;
};
export { Calendar };
