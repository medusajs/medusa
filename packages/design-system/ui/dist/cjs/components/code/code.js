"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
const tslib_1 = require("tslib");
const clx_1 = require("../../utils/clx");
const React = tslib_1.__importStar(require("react"));
/**
 * This component is based on the `code` element and supports all of its props
 */
const Code = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("code", { ref: ref, className: (0, clx_1.clx)("border-ui-tag-neutral-border bg-ui-tag-neutral-bg text-ui-tag-neutral-text txt-compact-small inline-flex rounded-md border px-[6px] font-mono", className), ...props }));
});
exports.Code = Code;
Code.displayName = "Code";
//# sourceMappingURL=code.js.map