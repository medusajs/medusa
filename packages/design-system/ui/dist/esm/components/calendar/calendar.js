"use client";
import { TriangleLeftMini, TriangleRightMini } from "@medusajs/icons";
import * as React from "react";
import { DayPicker, useDayRender, } from "react-day-picker";
import { clx } from "../../utils/clx";
import { iconButtonVariants } from "../icon-button";
/**
 * This component is based on the [react-date-picker](https://www.npmjs.com/package/react-date-picker) package.
 *
 * @excludeExternal
 */
const Calendar = ({ 
/**
 * @ignore
 */
className, 
/**
 * @ignore
 */
classNames, 
/**
 * The calendar's mode.
 */
mode = "single", 
/**
 * Whether to show days of previous and next months.
 *
 * @keep
 */
showOutsideDays = true, 
/**
 * The locale to use for formatting dates. To change the locale pass a date-fns locale object.
 *
 * @keep
 */
locale, ...props }) => {
    return (React.createElement(DayPicker, { mode: mode, showOutsideDays: showOutsideDays, className: clx(className), classNames: {
            months: "flex flex-col sm:flex-row",
            month: "space-y-2 p-3",
            caption: "flex justify-center relative items-center h-8",
            caption_label: "txt-compact-small-plus absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-ui-fg-base",
            nav: "space-x-1 flex items-center bg-ui-bg-base-pressed rounded-md w-full h-full justify-between p-0.5",
            nav_button: clx(iconButtonVariants({ variant: "transparent", size: "small" })),
            nav_button_previous: "!absolute left-0.5",
            nav_button_next: "!absolute right-0.5",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full gap-x-2",
            head_cell: clx("txt-compact-small-plus text-ui-fg-muted m-0 box-border flex h-8 w-8 items-center justify-center p-0"),
            row: "flex w-full mt-2 gap-x-2",
            cell: "txt-compact-small-plus relative rounded-md p-0 text-center focus-within:relative",
            day: "txt-compact-small-plus text-ui-fg-base bg-ui-bg-base hover:bg-ui-bg-base-hover focus-visible:shadow-borders-interactive-with-focus h-8 w-8 rounded-md p-0 text-center outline-none transition-all",
            day_selected: "bg-ui-bg-interactive text-ui-fg-on-color hover:bg-ui-bg-interactive focus-visible:bg-ui-bg-interactive",
            day_outside: "text-ui-fg-disabled aria-selected:text-ui-fg-on-color",
            day_disabled: "text-ui-fg-disabled",
            day_range_middle: "aria-selected:!bg-ui-bg-highlight aria-selected:!text-ui-fg-interactive",
            day_hidden: "invisible",
            ...classNames,
        }, locale: locale, components: {
            IconLeft: () => React.createElement(TriangleLeftMini, null),
            IconRight: () => React.createElement(TriangleRightMini, null),
            Day: Day,
        }, ...props }));
};
Calendar.displayName = "Calendar";
const Day = ({ date, displayMonth }) => {
    const ref = React.useRef(null);
    const { activeModifiers, buttonProps, divProps, isButton, isHidden } = useDayRender(date, displayMonth, ref);
    const { selected, today, disabled, range_middle } = activeModifiers;
    React.useEffect(() => {
        var _a;
        if (selected) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [selected]);
    if (isHidden) {
        return React.createElement(React.Fragment, null);
    }
    if (!isButton) {
        return (React.createElement("div", { ...divProps, className: clx("flex items-center justify-center", divProps.className) }));
    }
    const { children: buttonChildren, className: buttonClassName, ...buttonPropsRest } = buttonProps;
    return (React.createElement("button", { ref: ref, ...buttonPropsRest, type: "button", className: clx("relative", buttonClassName) },
        buttonChildren,
        today && (React.createElement("span", { className: clx("absolute right-[5px] top-[5px] h-1 w-1 rounded-full", {
                "bg-ui-fg-interactive": !selected,
                "bg-ui-fg-on-color": selected,
                "!bg-ui-fg-interactive": selected && range_middle,
                "bg-ui-fg-disabled": disabled,
            }) }))));
};
export { Calendar };
//# sourceMappingURL=calendar.js.map