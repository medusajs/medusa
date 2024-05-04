import { cva } from "cva";
import * as React from "react";
import { clx } from "../../utils/clx";
const headingVariants = cva({
    base: "font-sans font-medium",
    variants: {
        level: {
            h1: "h1-core",
            h2: "h2-core",
            h3: "h3-core",
        },
    },
    defaultVariants: {
        level: "h1",
    },
});
/**
 * This component is based on the heading element (`h1`, `h2`, etc...) depeneding on the specified level
 * and supports all of its props
 */
const Heading = ({ 
/**
 * The heading level which specifies which heading element is used.
 */
level = "h1", className, ...props }) => {
    const Component = level || "h1";
    return (React.createElement(Component, { className: clx(headingVariants({ level }), className), ...props }));
};
export { Heading, headingVariants };
//# sourceMappingURL=heading.js.map