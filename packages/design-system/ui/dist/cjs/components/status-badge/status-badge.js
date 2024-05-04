"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBadge = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const cva_1 = require("cva");
const statusBadgeVariants = (0, cva_1.cva)({
    base: "flex items-center justify-center w-5 h-[18px] [&_div]:w-2 [&_div]:h-2 [&_div]:rounded-sm",
    variants: {
        color: {
            green: "[&_div]:bg-ui-tag-green-icon",
            red: "[&_div]:bg-ui-tag-red-icon",
            orange: "[&_div]:bg-ui-tag-orange-icon",
            blue: "[&_div]:bg-ui-tag-blue-icon",
            purple: "[&_div]:bg-ui-tag-purple-icon",
            grey: "[&_div]:bg-ui-tag-neutral-icon",
        },
    },
    defaultVariants: {
        color: "grey",
    },
});
/**
 * This component is based on the span element and supports all of its props
 */
const StatusBadge = React.forwardRef(({ children, className, 
/**
 * The status's color.
 */
color = "grey", ...props }, ref) => {
    return (React.createElement("span", { ref: ref, className: (0, clx_1.clx)("txt-compact-xsmall-plus bg-ui-bg-subtle text-ui-fg-subtle border-ui-border-base box-border flex w-fit select-none items-center overflow-hidden rounded-md border pl-0 pr-1 leading-none", className), ...props },
        React.createElement("div", { role: "presentation", className: statusBadgeVariants({ color }) },
            React.createElement("div", null)),
        children));
});
exports.StatusBadge = StatusBadge;
StatusBadge.displayName = "StatusBadge";
//# sourceMappingURL=status-badge.js.map