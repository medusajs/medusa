import { type Locale } from "date-fns";
import * as React from "react";
import type { DateRange } from "../../types";
interface Preset {
    /**
     * The preset's label.
     */
    label: string;
}
interface DatePreset extends Preset {
    /**
     * The preset's selected date.
     */
    date: Date;
}
interface DateRangePreset extends Preset {
    /**
     * The preset's selected date range.
     */
    dateRange: DateRange;
}
type CalendarProps = {
    /**
     * The year to start showing the dates from.
     */
    fromYear?: number;
    /**
     * The year to show dates to.
     */
    toYear?: number;
    /**
     * The month to start showing dates from.
     */
    fromMonth?: Date;
    /**
     * The month to show dates to.
     */
    toMonth?: Date;
    /**
     * The day to start showing dates from.
     */
    fromDay?: Date;
    /**
     * The day to show dates to.
     */
    toDay?: Date;
    /**
     * The date to show dates from.
     */
    fromDate?: Date;
    /**
     * The date to show dates to.
     */
    toDate?: Date;
    /**
     * The locale to use for formatting dates. To change the locale pass a date-fns locale object.
     */
    locale?: Locale;
};
type Translations = {
    cancel?: string;
    apply?: string;
    start?: string;
    end?: string;
    range?: string;
};
interface PickerProps extends CalendarProps {
    /**
     * The class name to apply on the date picker.
     */
    className?: string;
    /**
     * Whether the date picker's input is disabled.
     */
    disabled?: boolean;
    /**
     * Whether the date picker's input is required.
     */
    required?: boolean;
    /**
     * The date picker's placeholder.
     */
    placeholder?: string;
    /**
     * The date picker's size.
     */
    size?: "small" | "base";
    /**
     * Whether to show a time picker along with the date picker.
     */
    showTimePicker?: boolean;
    /**
     * Translation keys for the date picker. Use this to localize the date picker.
     */
    translations?: Translations;
    id?: string;
    "aria-invalid"?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-required"?: boolean;
}
/**
 * @interface
 *
 * @prop presets - Provide selectable preset configurations.
 * @prop defaultValue - The date selected by default.
 * @prop value - The selected date.
 * @prop onChange - A function to handle the change in the selected date.
 */
type DatePickerProps = ({
    mode?: "single";
    presets?: DatePreset[];
    defaultValue?: Date;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
} | {
    mode: "range";
    presets?: DateRangePreset[];
    defaultValue?: DateRange;
    value?: DateRange;
    onChange?: (dateRange: DateRange | undefined) => void;
}) & PickerProps;
/**
 * This component is based on the [Calendar](https://docs.medusajs.com/ui/components/calendar)
 * component and [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover).
 */
declare const DatePicker: ({ mode, ...props }: DatePickerProps) => React.JSX.Element;
export { DatePicker };
