"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the `div` element and supports all of its props
 */
const Container = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: (0, clx_1.clx)("shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg px-8 pb-8 pt-6", className), ...props }));
});
exports.Container = Container;
Container.displayName = "Container";
//# sourceMappingURL=container.js.map