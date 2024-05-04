"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const tslib_1 = require("tslib");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-avatar"));
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const avatarVariants = (0, cva_1.cva)({
    base: "border-ui-border-strong flex shrink-0 items-center justify-center overflow-hidden border",
    variants: {
        variant: {
            squared: "",
            rounded: "rounded-full",
        },
        size: {
            "2xsmall": "h-5 w-5",
            xsmall: "h-6 w-6",
            small: "h-7 w-7",
            base: "h-8 w-8",
            large: "h-10 w-10",
            xlarge: "h-12 w-12",
        },
    },
    compoundVariants: [
        {
            variant: "squared",
            size: "2xsmall",
            className: "rounded-md",
        },
        {
            variant: "squared",
            size: "xsmall",
            className: "rounded-md",
        },
        {
            variant: "squared",
            size: "small",
            className: "rounded-md",
        },
        {
            variant: "squared",
            size: "base",
            className: "rounded-md",
        },
        {
            variant: "squared",
            size: "large",
            className: "rounded-lg",
        },
        {
            variant: "squared",
            size: "xlarge",
            className: "rounded-xl",
        },
    ],
    defaultVariants: {
        variant: "rounded",
        size: "base",
    },
});
const innerVariants = (0, cva_1.cva)({
    base: "aspect-square object-cover object-center",
    variants: {
        variant: {
            squared: "",
            rounded: "rounded-full",
        },
        size: {
            "2xsmall": "txt-compact-xsmall-plus h-4 w-4",
            xsmall: "txt-compact-xsmall-plus h-5 w-5",
            small: "txt-compact-small-plus h-6 w-6",
            base: "txt-compact-small-plus h-7 w-7",
            large: "txt-compact-medium-plus h-9 w-9",
            xlarge: "txt-compact-large-plus h-11 w-11",
        },
    },
    compoundVariants: [
        {
            variant: "squared",
            size: "2xsmall",
            className: "rounded-sm",
        },
        {
            variant: "squared",
            size: "xsmall",
            className: "rounded-sm",
        },
        {
            variant: "squared",
            size: "small",
            className: "rounded-[4px]",
        },
        {
            variant: "squared",
            size: "base",
            className: "rounded-[4px]",
        },
        {
            variant: "squared",
            size: "large",
            className: "rounded-md",
        },
        {
            variant: "squared",
            size: "xlarge",
            className: "rounded-[10px]",
        },
    ],
    defaultVariants: {
        variant: "rounded",
        size: "base",
    },
});
/**
 * This component is based on the [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar) primitive.
 */
const Avatar = React.forwardRef(({ 
/**
 * The URL of the image used in the Avatar.
 */
src, 
/**
 * Text to show in the avatar if the URL provided in `src` can't be opened.
 */
fallback, 
/**
 * The style of the avatar.
 */
variant = "rounded", 
/**
 * The size of the avatar's border radius.
 */
size = "base", className, ...props }, ref) => {
    return (React.createElement(Primitives.Root, { ref: ref, ...props, className: (0, clx_1.clx)("rounded-x", avatarVariants({ variant, size }), className) },
        src && (React.createElement(Primitives.Image, { src: src, className: innerVariants({ variant, size }) })),
        React.createElement(Primitives.Fallback, { className: (0, clx_1.clx)(innerVariants({ variant, size }), "bg-ui-bg-component text-ui-fg-subtle pointer-events-none flex select-none items-center justify-center") }, fallback)));
});
exports.Avatar = Avatar;
Avatar.displayName = "Avatar";
//# sourceMappingURL=avatar.js.map