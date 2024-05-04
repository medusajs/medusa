"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
const tslib_1 = require("tslib");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-label"));
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const labelVariants = (0, cva_1.cva)({
    base: "font-sans",
    variants: {
        size: {
            xsmall: "txt-compact-xsmall",
            small: "txt-compact-small",
            base: "txt-compact-medium",
            large: "txt-compact-large",
        },
        weight: {
            regular: "font-normal",
            plus: "font-medium",
        },
    },
    defaultVariants: {
        size: "base",
        weight: "regular",
    },
});
/**
 * This component is based on the [Radix UI Label](https://www.radix-ui.com/primitives/docs/components/label) primitive.
 */
const Label = React.forwardRef(({ className, 
/**
 * The label's size.
 */
size = "base", 
/**
 * The label's font weight.
 */
weight = "regular", ...props }, ref) => {
    return (React.createElement(Primitives.Root, { ref: ref, className: (0, clx_1.clx)(labelVariants({ size, weight }), className), ...props }));
});
exports.Label = Label;
Label.displayName = "Label";
//# sourceMappingURL=label.js.map