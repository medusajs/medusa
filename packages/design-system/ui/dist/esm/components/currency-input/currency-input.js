"use client";
import * as React from "react";
import Primitive from "react-currency-input-field";
import { Text } from "../text";
import { clx } from "../../utils/clx";
import { cva } from "cva";
const currencyInputVariants = cva({
    base: clx("flex items-center gap-x-1", "bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-buttons-neutral placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full rounded-md", "focus-within:shadow-borders-interactive-with-active"),
    variants: {
        size: {
            base: "txt-compact-medium h-8",
            small: "txt-compact-small h-7",
        },
    },
    defaultVariants: {
        size: "base",
    },
});
/**
 * This component is based on the input element and supports all of its props
 *
 * @excludeExternal
 */
const CurrencyInput = React.forwardRef(({ 
/**
 * The input's size.
 */
size = "base", 
/**
 * The symbol to show in the input.
 */
symbol, 
/**
 * The currency code to show in the input.
 */
code, disabled, onInvalid, className, ...props }, ref) => {
    const innerRef = React.useRef(null);
    React.useImperativeHandle(ref, () => innerRef.current);
    const [valid, setValid] = React.useState(true);
    const onInnerInvalid = React.useCallback((event) => {
        setValid(event.currentTarget.validity.valid);
        if (onInvalid) {
            onInvalid(event);
        }
    }, [onInvalid]);
    return (React.createElement("div", { onClick: () => {
            if (innerRef.current) {
                innerRef.current.focus();
            }
        }, className: clx("w-full cursor-text justify-between overflow-hidden", currencyInputVariants({ size }), {
            "text-ui-fg-disabled !bg-ui-bg-disabled !shadow-buttons-neutral !placeholder-ui-fg-disabled cursor-not-allowed": disabled,
            "!shadow-borders-error invalid:!shadow-borders-error": props["aria-invalid"] || !valid,
        }, className) },
        React.createElement("span", { className: clx("w-fit min-w-[32px] border-r px-2", {
                "py-[9px]": size === "base",
                "py-[5px]": size === "small",
            }), role: "presentation" },
            React.createElement(Text, { size: "small", leading: "compact", className: clx("text-ui-fg-muted pointer-events-none select-none uppercase", {
                    "text-ui-fg-disabled": disabled,
                }) }, code)),
        React.createElement(Primitive, { className: "h-full min-w-0 flex-1 appearance-none bg-transparent text-right outline-none disabled:cursor-not-allowed", disabled: disabled, onInvalid: onInnerInvalid, ref: innerRef, ...props }),
        React.createElement("span", { className: clx("flex w-fit min-w-[32px] items-center justify-center border-l px-2 text-right", {
                "py-[9px]": size === "base",
                "py-[5px]": size === "small",
            }), role: "presentation" },
            React.createElement(Text, { size: "small", leading: "compact", className: clx("text-ui-fg-muted pointer-events-none select-none", {
                    "text-ui-fg-disabled": disabled,
                }) }, symbol))));
});
CurrencyInput.displayName = "CurrencyInput";
export { CurrencyInput };
//# sourceMappingURL=currency-input.js.map