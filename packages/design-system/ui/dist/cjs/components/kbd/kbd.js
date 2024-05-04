"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kbd = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the `kbd` element and supports all of its props
 */
const Kbd = React.forwardRef(({ children, className, ...props }, ref) => {
    return (React.createElement("kbd", { ...props, ref: ref, className: (0, clx_1.clx)("bg-ui-tag-neutral-bg text-ui-tag-neutral-text border-ui-tag-neutral-border inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded-md border px-1", "txt-compact-xsmall-plus", className) }, children));
});
exports.Kbd = Kbd;
Kbd.displayName = "Kbd";
//# sourceMappingURL=kbd.js.map