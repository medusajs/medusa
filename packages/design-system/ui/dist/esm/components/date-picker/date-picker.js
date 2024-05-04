"use client";
import { Time } from "@internationalized/date";
import { Calendar as CalendarIcon, Minus } from "@medusajs/icons";
import * as Primitives from "@radix-ui/react-popover";
import { format } from "date-fns";
import * as React from "react";
import { Button } from "../button";
import { Calendar as CalendarPrimitive } from "../calendar";
import { TimeInput } from "../time-input";
import { clx } from "../../utils/clx";
import { isBrowserLocaleClockType24h } from "../../utils/is-browser-locale-hour-cycle-24h";
import { cva } from "cva";
const displayVariants = cva({
    base: clx("text-ui-fg-base bg-ui-bg-field transition-fg shadow-buttons-neutral flex w-full items-center gap-x-2 rounded-md outline-none", "hover:bg-ui-bg-field-hover", "focus-visible:shadow-borders-interactive-with-active data-[state=open]:shadow-borders-interactive-with-active", "disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral", "aria-[invalid=true]:!shadow-borders-error"),
    variants: {
        size: {
            base: "txt-compact-small h-8 px-2 py-1.5",
            small: "txt-compact-small h-7 px-2 py-1",
        },
    },
    defaultVariants: {
        size: "base",
    },
});
const Display = React.forwardRef(({ className, children, 
/**
 * Placeholder of the date picker's input.
 */
placeholder, 
/**
 * The size of the date picker's input.
 */
size = "base", ...props }, ref) => {
    return (React.createElement(Primitives.Trigger, { asChild: true },
        React.createElement("button", { ref: ref, className: clx(displayVariants({ size }), className), ...props },
            React.createElement(CalendarIcon, { className: "text-ui-fg-muted" }),
            React.createElement("span", { className: "flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left" }, children ? (children) : placeholder ? (React.createElement("span", { className: "text-ui-fg-muted" }, placeholder)) : null))));
});
Display.displayName = "DatePicker.Display";
const Flyout = React.forwardRef(({ className, children, ...props }, ref) => {
    return (React.createElement(Primitives.Portal, null,
        React.createElement(Primitives.Content, { ref: ref, sideOffset: 8, align: "center", className: clx("txt-compact-small shadow-elevation-flyout bg-ui-bg-base w-fit rounded-lg", "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className), ...props }, children)));
});
Flyout.displayName = "DatePicker.Flyout";
const PresetContainer = ({ 
/**
 * Selectable preset configurations.
 */
presets, 
/**
 * A function that handles the event when a preset is selected.
 */
onSelect, 
/**
 * The currently selected preset.
 */
currentValue, }) => {
    const isDateRangePresets = (preset) => {
        return "dateRange" in preset;
    };
    const isDatePresets = (preset) => {
        return "date" in preset;
    };
    const handleClick = (preset) => {
        if (isDateRangePresets(preset)) {
            onSelect(preset.dateRange);
        }
        else if (isDatePresets(preset)) {
            onSelect(preset.date);
        }
    };
    const compareDates = (date1, date2) => {
        return (date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear());
    };
    const compareRanges = (range1, range2) => {
        const from1 = range1.from;
        const from2 = range2.from;
        let equalFrom = false;
        if (from1 && from2) {
            const sameFrom = compareDates(from1, from2);
            if (sameFrom) {
                equalFrom = true;
            }
        }
        const to1 = range1.to;
        const to2 = range2.to;
        let equalTo = false;
        if (to1 && to2) {
            const sameTo = compareDates(to1, to2);
            if (sameTo) {
                equalTo = true;
            }
        }
        return equalFrom && equalTo;
    };
    const matchesCurrent = (preset) => {
        if (isDateRangePresets(preset)) {
            const value = currentValue;
            return value && compareRanges(value, preset.dateRange);
        }
        else if (isDatePresets(preset)) {
            const value = currentValue;
            return value && compareDates(value, preset.date);
        }
        return false;
    };
    return (React.createElement("ul", { className: "flex flex-col items-start" }, presets.map((preset, index) => {
        return (React.createElement("li", { key: index, className: "w-full" },
            React.createElement("button", { className: clx("txt-compact-small-plus w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md p-2 text-left", "text-ui-fg-subtle hover:bg-ui-bg-base-hover outline-none transition-all", "focus-visible:bg-ui-bg-base-hover", {
                    "!bg-ui-bg-base-pressed": matchesCurrent(preset),
                }), onClick: () => handleClick(preset), "aria-label": `Select ${preset.label}` }, preset.label)));
    })));
};
PresetContainer.displayName = "DatePicker.PresetContainer";
const formatDate = (date, includeTime) => {
    const usesAmPm = !isBrowserLocaleClockType24h();
    if (includeTime) {
        if (usesAmPm) {
            return format(date, "MMM d, yyyy h:mm a");
        }
        return format(date, "MMM d, yyyy HH:mm");
    }
    return format(date, "MMM d, yyyy");
};
const SingleDatePicker = ({ defaultValue, value, size = "base", onChange, presets, showTimePicker, disabled, className, placeholder, translations, ...props }) => {
    var _a, _b, _c;
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState((_a = value !== null && value !== void 0 ? value : defaultValue) !== null && _a !== void 0 ? _a : undefined);
    const [month, setMonth] = React.useState(date);
    const [time, setTime] = React.useState(value
        ? new Time(value.getHours(), value.getMinutes())
        : defaultValue
            ? new Time(defaultValue.getHours(), defaultValue.getMinutes())
            : new Time(0, 0));
    const initialDate = React.useMemo(() => {
        return date;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    /**
     * Update the date when the value changes.
     */
    React.useEffect(() => {
        var _a;
        setDate((_a = value !== null && value !== void 0 ? value : defaultValue) !== null && _a !== void 0 ? _a : undefined);
    }, [value, defaultValue]);
    React.useEffect(() => {
        if (date) {
            setMonth(date);
        }
    }, [date]);
    React.useEffect(() => {
        if (!open) {
            setMonth(date);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const onCancel = () => {
        setDate(initialDate);
        setTime(initialDate
            ? new Time(initialDate.getHours(), initialDate.getMinutes())
            : new Time(0, 0));
        setOpen(false);
    };
    const onOpenChange = (open) => {
        if (!open) {
            onCancel();
        }
        setOpen(open);
    };
    const onDateChange = (date) => {
        const newDate = date;
        if (showTimePicker) {
            /**
             * If the time is cleared, and the date is
             * changed then we want to reset the time.
             */
            if (newDate && !time) {
                setTime(new Time(0, 0));
            }
            /**
             * If the time is set, and the date is changed
             * then we want to update the date with the
             * time.
             */
            if (newDate && time) {
                newDate.setHours(time.hour);
                newDate.setMinutes(time.minute);
            }
        }
        setDate(newDate);
    };
    const onTimeChange = (time) => {
        setTime(time);
        if (!date) {
            return;
        }
        const newDate = new Date(date.getTime());
        if (!time) {
            /**
             * When a segment of the time input is cleared,
             * it will return `null` as the value is no longer
             * a valid time. In this case, we want to set the
             * time to for the date, effectivly resetting the
             * input field.
             */
            newDate.setHours(0);
            newDate.setMinutes(0);
        }
        else {
            newDate.setHours(time.hour);
            newDate.setMinutes(time.minute);
        }
        setDate(newDate);
    };
    const formattedDate = React.useMemo(() => {
        if (!date) {
            return null;
        }
        return formatDate(date, showTimePicker);
    }, [date, showTimePicker]);
    const onApply = () => {
        setOpen(false);
        onChange === null || onChange === void 0 ? void 0 : onChange(date);
    };
    return (React.createElement(Primitives.Root, { open: open, onOpenChange: onOpenChange },
        React.createElement(Display, { placeholder: placeholder, disabled: disabled, className: className, "aria-required": props.required || props["aria-required"], "aria-invalid": props["aria-invalid"], "aria-label": props["aria-label"], "aria-labelledby": props["aria-labelledby"], size: size }, formattedDate),
        React.createElement(Flyout, null,
            React.createElement("div", { className: "flex" },
                React.createElement("div", { className: "flex items-start" },
                    presets && presets.length > 0 && (React.createElement("div", { className: "relative h-full w-[160px] border-r" },
                        React.createElement("div", { className: "absolute inset-0 overflow-y-scroll p-3" },
                            React.createElement(PresetContainer, { currentValue: date, presets: presets, onSelect: onDateChange })))),
                    React.createElement("div", null,
                        React.createElement(CalendarPrimitive, { mode: "single", month: month, onMonthChange: setMonth, selected: date, onSelect: onDateChange, disabled: disabled, ...props }),
                        showTimePicker && (React.createElement("div", { className: "border-ui-border-base border-t p-3" },
                            React.createElement(TimeInput, { "aria-label": "Time", onChange: onTimeChange, isDisabled: !date, value: time, isRequired: props.required }))),
                        React.createElement("div", { className: "border-ui-border-base flex items-center gap-x-2 border-t p-3" },
                            React.createElement(Button, { variant: "secondary", size: "small", className: "w-full", type: "button", onClick: onCancel }, (_b = translations === null || translations === void 0 ? void 0 : translations.cancel) !== null && _b !== void 0 ? _b : "Cancel"),
                            React.createElement(Button, { variant: "primary", size: "small", className: "w-full", type: "button", onClick: onApply }, (_c = translations === null || translations === void 0 ? void 0 : translations.apply) !== null && _c !== void 0 ? _c : "Apply"))))))));
};
const RangeDatePicker = ({ 
/**
 * The date range selected by default.
 */
defaultValue, 
/**
 * The selected date range.
 */
value, 
/**
 * A function to handle the change in the selected date range.
 */
onChange, size = "base", showTimePicker, 
/**
 * Provide selectable preset configurations.
 */
presets, disabled, className, placeholder, translations, ...props }) => {
    var _a, _b, _c, _d, _e, _f;
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState((_a = value !== null && value !== void 0 ? value : defaultValue) !== null && _a !== void 0 ? _a : undefined);
    const [month, setMonth] = React.useState(range === null || range === void 0 ? void 0 : range.from);
    const [startTime, setStartTime] = React.useState((value === null || value === void 0 ? void 0 : value.from)
        ? new Time(value.from.getHours(), value.from.getMinutes())
        : (defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.from)
            ? new Time(defaultValue.from.getHours(), defaultValue.from.getMinutes())
            : new Time(0, 0));
    const [endTime, setEndTime] = React.useState((value === null || value === void 0 ? void 0 : value.to)
        ? new Time(value.to.getHours(), value.to.getMinutes())
        : (defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.to)
            ? new Time(defaultValue.to.getHours(), defaultValue.to.getMinutes())
            : new Time(0, 0));
    const initialRange = React.useMemo(() => {
        return range;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    /**
     * Update the range when the value changes.
     */
    React.useEffect(() => {
        var _a;
        setRange((_a = value !== null && value !== void 0 ? value : defaultValue) !== null && _a !== void 0 ? _a : undefined);
    }, [value, defaultValue]);
    React.useEffect(() => {
        if (range) {
            setMonth(range.from);
        }
    }, [range]);
    React.useEffect(() => {
        if (!open) {
            setMonth(range === null || range === void 0 ? void 0 : range.from);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const onRangeChange = (range) => {
        const newRange = range;
        if (showTimePicker) {
            if ((newRange === null || newRange === void 0 ? void 0 : newRange.from) && !startTime) {
                setStartTime(new Time(0, 0));
            }
            if ((newRange === null || newRange === void 0 ? void 0 : newRange.to) && !endTime) {
                setEndTime(new Time(0, 0));
            }
            if ((newRange === null || newRange === void 0 ? void 0 : newRange.from) && startTime) {
                newRange.from.setHours(startTime.hour);
                newRange.from.setMinutes(startTime.minute);
            }
            if ((newRange === null || newRange === void 0 ? void 0 : newRange.to) && endTime) {
                newRange.to.setHours(endTime.hour);
                newRange.to.setMinutes(endTime.minute);
            }
        }
        setRange(newRange);
    };
    const onCancel = () => {
        setRange(initialRange);
        setStartTime((initialRange === null || initialRange === void 0 ? void 0 : initialRange.from)
            ? new Time(initialRange.from.getHours(), initialRange.from.getMinutes())
            : new Time(0, 0));
        setEndTime((initialRange === null || initialRange === void 0 ? void 0 : initialRange.to)
            ? new Time(initialRange.to.getHours(), initialRange.to.getMinutes())
            : new Time(0, 0));
        setOpen(false);
    };
    const onOpenChange = (open) => {
        if (!open) {
            onCancel();
        }
        setOpen(open);
    };
    const onTimeChange = (time, pos) => {
        switch (pos) {
            case "start":
                setStartTime(time);
                break;
            case "end":
                setEndTime(time);
                break;
        }
        if (!range) {
            return;
        }
        if (pos === "start") {
            if (!range.from) {
                return;
            }
            const newDate = new Date(range.from.getTime());
            if (!time) {
                newDate.setHours(0);
                newDate.setMinutes(0);
            }
            else {
                newDate.setHours(time.hour);
                newDate.setMinutes(time.minute);
            }
            setRange({
                ...range,
                from: newDate,
            });
        }
        if (pos === "end") {
            if (!range.to) {
                return;
            }
            const newDate = new Date(range.to.getTime());
            if (!time) {
                newDate.setHours(0);
                newDate.setMinutes(0);
            }
            else {
                newDate.setHours(time.hour);
                newDate.setMinutes(time.minute);
            }
            setRange({
                ...range,
                to: newDate,
            });
        }
    };
    const displayRange = React.useMemo(() => {
        if (!range) {
            return null;
        }
        return `${range.from ? formatDate(range.from, showTimePicker) : ""} - ${range.to ? formatDate(range.to, showTimePicker) : ""}`;
    }, [range, showTimePicker]);
    const onApply = () => {
        setOpen(false);
        onChange === null || onChange === void 0 ? void 0 : onChange(range);
    };
    return (React.createElement(Primitives.Root, { open: open, onOpenChange: onOpenChange },
        React.createElement(Display, { placeholder: placeholder, disabled: disabled, className: className, "aria-required": props.required || props["aria-required"], "aria-invalid": props["aria-invalid"], "aria-label": props["aria-label"], "aria-labelledby": props["aria-labelledby"], size: size }, displayRange),
        React.createElement(Flyout, null,
            React.createElement("div", { className: "flex" },
                React.createElement("div", { className: "flex items-start" },
                    presets && presets.length > 0 && (React.createElement("div", { className: "relative h-full w-[160px] border-r" },
                        React.createElement("div", { className: "absolute inset-0 overflow-y-scroll p-3" },
                            React.createElement(PresetContainer, { currentValue: range, presets: presets, onSelect: onRangeChange })))),
                    React.createElement("div", null,
                        React.createElement(CalendarPrimitive, { mode: "range", selected: range, onSelect: onRangeChange, month: month, onMonthChange: setMonth, numberOfMonths: 2, disabled: disabled, classNames: {
                                months: "flex flex-row divide-x divide-ui-border-base",
                            }, ...props }),
                        showTimePicker && (React.createElement("div", { className: "border-ui-border-base flex items-center justify-evenly gap-x-3 border-t p-3" },
                            React.createElement("div", { className: "flex flex-1 items-center gap-x-2" },
                                React.createElement("span", { className: "text-ui-fg-subtle" }, (_b = translations === null || translations === void 0 ? void 0 : translations.start) !== null && _b !== void 0 ? _b : "Start",
                                    ":"),
                                React.createElement(TimeInput, { value: startTime, onChange: (v) => onTimeChange(v, "start"), "aria-label": "Start date time", isDisabled: !(range === null || range === void 0 ? void 0 : range.from), isRequired: props.required })),
                            React.createElement(Minus, { className: "text-ui-fg-muted" }),
                            React.createElement("div", { className: "flex flex-1 items-center gap-x-2" },
                                React.createElement("span", { className: "text-ui-fg-subtle" }, (_c = translations === null || translations === void 0 ? void 0 : translations.end) !== null && _c !== void 0 ? _c : "End",
                                    ":"),
                                React.createElement(TimeInput, { value: endTime, onChange: (v) => onTimeChange(v, "end"), "aria-label": "End date time", isDisabled: !(range === null || range === void 0 ? void 0 : range.to), isRequired: props.required })))),
                        React.createElement("div", { className: "flex items-center justify-between border-t p-3" },
                            React.createElement("p", { className: clx("text-ui-fg-subtle txt-compact-small-plus") },
                                React.createElement("span", { className: "text-ui-fg-muted" }, (_d = translations === null || translations === void 0 ? void 0 : translations.range) !== null && _d !== void 0 ? _d : "Range",
                                    ":"),
                                " ",
                                displayRange),
                            React.createElement("div", { className: "flex items-center gap-x-2" },
                                React.createElement(Button, { size: "small", variant: "secondary", type: "button", onClick: onCancel }, (_e = translations === null || translations === void 0 ? void 0 : translations.cancel) !== null && _e !== void 0 ? _e : "Cancel"),
                                React.createElement(Button, { size: "small", variant: "primary", type: "button", onClick: onApply }, (_f = translations === null || translations === void 0 ? void 0 : translations.apply) !== null && _f !== void 0 ? _f : "Apply")))))))));
};
const validatePresets = (presets, rules) => {
    const { toYear, fromYear, fromMonth, toMonth, fromDay, toDay } = rules;
    if (presets && presets.length > 0) {
        const fromYearToUse = fromYear;
        const toYearToUse = toYear;
        presets.forEach((preset) => {
            var _a, _b, _c, _d, _e, _f;
            if ("date" in preset) {
                const presetYear = preset.date.getFullYear();
                if (fromYear && presetYear < fromYear) {
                    throw new Error(`Preset ${preset.label} is before fromYear ${fromYearToUse}.`);
                }
                if (toYear && presetYear > toYear) {
                    throw new Error(`Preset ${preset.label} is after toYear ${toYearToUse}.`);
                }
                if (fromMonth) {
                    const presetMonth = preset.date.getMonth();
                    if (presetMonth < fromMonth.getMonth()) {
                        throw new Error(`Preset ${preset.label} is before fromMonth ${fromMonth}.`);
                    }
                }
                if (toMonth) {
                    const presetMonth = preset.date.getMonth();
                    if (presetMonth > toMonth.getMonth()) {
                        throw new Error(`Preset ${preset.label} is after toMonth ${toMonth}.`);
                    }
                }
                if (fromDay) {
                    const presetDay = preset.date.getDate();
                    if (presetDay < fromDay.getDate()) {
                        throw new Error(`Preset ${preset.label} is before fromDay ${fromDay}.`);
                    }
                }
                if (toDay) {
                    const presetDay = preset.date.getDate();
                    if (presetDay > toDay.getDate()) {
                        throw new Error(`Preset ${preset.label} is after toDay ${format(toDay, "MMM dd, yyyy")}.`);
                    }
                }
            }
            if ("dateRange" in preset) {
                const presetFromYear = (_a = preset.dateRange.from) === null || _a === void 0 ? void 0 : _a.getFullYear();
                const presetToYear = (_b = preset.dateRange.to) === null || _b === void 0 ? void 0 : _b.getFullYear();
                if (presetFromYear && fromYear && presetFromYear < fromYear) {
                    throw new Error(`Preset ${preset.label}'s 'from' is before fromYear ${fromYearToUse}.`);
                }
                if (presetToYear && toYear && presetToYear > toYear) {
                    throw new Error(`Preset ${preset.label}'s 'to' is after toYear ${toYearToUse}.`);
                }
                if (fromMonth) {
                    const presetMonth = (_c = preset.dateRange.from) === null || _c === void 0 ? void 0 : _c.getMonth();
                    if (presetMonth && presetMonth < fromMonth.getMonth()) {
                        throw new Error(`Preset ${preset.label}'s 'from' is before fromMonth ${format(fromMonth, "MMM, yyyy")}.`);
                    }
                }
                if (toMonth) {
                    const presetMonth = (_d = preset.dateRange.to) === null || _d === void 0 ? void 0 : _d.getMonth();
                    if (presetMonth && presetMonth > toMonth.getMonth()) {
                        throw new Error(`Preset ${preset.label}'s 'to' is after toMonth ${format(toMonth, "MMM, yyyy")}.`);
                    }
                }
                if (fromDay) {
                    const presetDay = (_e = preset.dateRange.from) === null || _e === void 0 ? void 0 : _e.getDate();
                    if (presetDay && presetDay < fromDay.getDate()) {
                        throw new Error(`Preset ${preset.dateRange.from}'s 'from' is before fromDay ${format(fromDay, "MMM dd, yyyy")}.`);
                    }
                }
                if (toDay) {
                    const presetDay = (_f = preset.dateRange.to) === null || _f === void 0 ? void 0 : _f.getDate();
                    if (presetDay && presetDay > toDay.getDate()) {
                        throw new Error(`Preset ${preset.label}'s 'to' is after toDay ${format(toDay, "MMM dd, yyyy")}.`);
                    }
                }
            }
        });
    }
};
/**
 * This component is based on the [Calendar](https://docs.medusajs.com/ui/components/calendar)
 * component and [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover).
 */
const DatePicker = ({ 
/**
 * The date picker's mode.
 */
mode = "single", ...props }) => {
    if (props.presets) {
        validatePresets(props.presets, props);
    }
    if (mode === "single") {
        return React.createElement(SingleDatePicker, { ...props });
    }
    return React.createElement(RangeDatePicker, { ...props });
};
export { DatePicker };
//# sourceMappingURL=date-picker.js.map