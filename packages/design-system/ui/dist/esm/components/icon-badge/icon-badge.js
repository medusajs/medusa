import { Slot } from "@radix-ui/react-slot";
import { cva } from "cva";
import * as React from "react";
import { badgeColorVariants } from "../badge";
import { clx } from "../../utils/clx";
const iconBadgeVariants = cva({
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
    const Component = asChild ? Slot : "span";
    return (React.createElement(Component, { ref: ref, className: clx(badgeColorVariants({ color }), iconBadgeVariants({ size }), className), ...props }, children));
});
IconBadge.displayName = "IconBadge";
export { IconBadge };
//# sourceMappingURL=icon-badge.js.map