"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconBadge = void 0;
const tslib_1 = require("tslib");
const react_slot_1 = require("@radix-ui/react-slot");
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const badge_1 = require("../badge");
const clx_1 = require("../../utils/clx");
const iconBadgeVariants = (0, cva_1.cva)({
    base: "flex items-center justify-center overflow-hidden rounded-md border",
    variants: {
        size: {
            base: "h-6 w-6",
            large: "h-7 w-7",
        },
    },
});
/**
 * This component is based on the `span` element and supports all of its props
 */
const IconBadge = React.forwardRef(({ children, className, 
/**
 * The badge's color.
 */
color = "grey", 
/**
 * The badge's size.
 */
size = "base", 
/**
 * Whether to remove the wrapper `span` element and use the
 * passed child element instead.
 */
asChild = false, ...props }, ref) => {
    const Component = asChild ? react_slot_1.Slot : "span";
    return (React.createElement(Component, { ref: ref, className: (0, clx_1.clx)((0, badge_1.badgeColorVariants)({ color }), iconBadgeVariants({ size }), className), ...props }, children));
});
exports.IconBadge = IconBadge;
IconBadge.displayName = "IconBadge";
//# sourceMappingURL=icon-badge.js.map