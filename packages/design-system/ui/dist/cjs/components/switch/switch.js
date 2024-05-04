"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const tslib_1 = require("tslib");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-switch"));
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const switchVariants = (0, cva_1.cva)({
    base: "bg-ui-bg-switch-off hover:bg-ui-bg-switch-off-hover data-[state=unchecked]:hover:after:bg-switch-off-hover-gradient before:shadow-details-switch-background focus-visible:shadow-details-switch-background-focus data-[state=checked]:bg-ui-bg-interactive disabled:!bg-ui-bg-disabled group relative inline-flex items-center rounded-full outline-none transition-all before:absolute before:inset-0 before:rounded-full before:content-[''] after:absolute after:inset-0 after:rounded-full after:content-[''] disabled:cursor-not-allowed",
    variants: {
        size: {
            small: "h-[16px] w-[28px]",
            base: "h-[18px] w-[32px]",
        },
    },
    defaultVariants: {
        size: "base",
    },
});
const thumbVariants = (0, cva_1.cva)({
    base: "bg-ui-fg-on-color shadow-details-switch-handle group-disabled:bg-ui-fg-disabled pointer-events-none h-[14px] w-[14px] rounded-full transition-all group-disabled:shadow-none",
    variants: {
        size: {
            small: "h-[12px] w-[12px] data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0.5",
            base: "h-[14px] w-[14px] transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5",
        },
    },
    defaultVariants: {
        size: "base",
    },
});
/**
 * This component is based on the [Radix UI Switch](https://www.radix-ui.com/primitives/docs/components/switch) primitive.
 */
const Switch = React.forwardRef(({ className, 
/**
 * The switch's size.
 */
size = "base", ...props }, ref) => (React.createElement(Primitives.Root, { className: (0, clx_1.clx)(switchVariants({ size }), className), ...props, ref: ref },
    React.createElement(Primitives.Thumb, { className: (0, clx_1.clx)(thumbVariants({ size })) }))));
exports.Switch = Switch;
Switch.displayName = "Switch";
//# sourceMappingURL=switch.js.map