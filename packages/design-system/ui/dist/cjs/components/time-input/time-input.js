"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeInput = void 0;
const tslib_1 = require("tslib");
const datepicker_1 = require("@react-aria/datepicker");
const datepicker_2 = require("@react-stately/datepicker");
const React = tslib_1.__importStar(require("react"));
const input_1 = require("../input");
const clx_1 = require("../../utils/clx");
const TimeSegment = ({ segment, state }) => {
    const ref = React.useRef(null);
    const { segmentProps } = (0, datepicker_1.useDateSegment)(segment, state, ref);
    const isColon = segment.type === "literal" && segment.text === ":";
    const isSpace = segment.type === "literal" && segment.text === " ";
    const isDecorator = isColon || isSpace;
    return (React.createElement("div", { ...segmentProps, ref: ref, className: (0, clx_1.clx)("txt-compact-small w-full rounded-md px-2 py-1 text-left uppercase tabular-nums", input_1.inputBaseStyles, "group-aria-[invalid=true]/time-input:!shadow-borders-error group-invalid/time-input:!shadow-borders-error", {
            "text-ui-fg-muted !w-fit border-none bg-transparent px-0 shadow-none": isDecorator,
            hidden: isSpace,
            "text-ui-fg-disabled bg-ui-bg-disabled border-ui-border-base shadow-none": state.isDisabled,
            "!text-ui-fg-muted !bg-transparent": !segment.isEditable,
        }) },
        React.createElement("span", { "aria-hidden": "true", className: (0, clx_1.clx)("txt-compact-small text-ui-fg-muted pointer-events-none block w-full text-left", {
                hidden: !segment.isPlaceholder,
                "h-0": !segment.isPlaceholder,
            }) }, segment.placeholder),
        segment.isPlaceholder ? "" : segment.text));
};
/**
 * This component is based on the `div` element and supports all of its props.
 */
const TimeInput = React.forwardRef(({ 
/**
 * The time's format. If no value is specified, the format is
 * set based on the user's locale.
 */
hourCycle, ...props }, ref) => {
    const innerRef = React.useRef(null);
    React.useImperativeHandle(ref, () => innerRef === null || innerRef === void 0 ? void 0 : innerRef.current);
    const locale = window !== undefined ? window.navigator.language : "en-US";
    const state = (0, datepicker_2.useTimeFieldState)({
        hourCycle: hourCycle,
        locale: locale,
        shouldForceLeadingZeros: true,
        autoFocus: true,
        ...props,
    });
    const { fieldProps } = (0, datepicker_1.useTimeField)({
        ...props,
        hourCycle: hourCycle,
        shouldForceLeadingZeros: true,
    }, state, innerRef);
    return (React.createElement("div", { ...fieldProps, ref: innerRef, className: "group/time-input inline-flex w-full gap-x-2" }, state.segments.map((segment, i) => (React.createElement(TimeSegment, { key: i, segment: segment, state: state })))));
});
exports.TimeInput = TimeInput;
TimeInput.displayName = "TimeInput";
//# sourceMappingURL=time-input.js.map