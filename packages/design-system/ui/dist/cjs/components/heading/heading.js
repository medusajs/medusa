"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headingVariants = exports.Heading = void 0;
const tslib_1 = require("tslib");
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const headingVariants = (0, cva_1.cva)({
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
exports.headingVariants = headingVariants;
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
    return (React.createElement(Component, { className: (0, clx_1.clx)(headingVariants({ level }), className), ...props }));
};
exports.Heading = Heading;
//# sourceMappingURL=heading.js.map