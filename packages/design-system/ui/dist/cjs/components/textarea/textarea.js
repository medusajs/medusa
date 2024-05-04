"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textarea = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const input_1 = require("../input");
/**
 * This component is based on the `textarea` element and supports all of its props
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("textarea", { ref: ref, className: (0, clx_1.clx)(input_1.inputBaseStyles, "txt-small min-h-[60px] w-full px-2 py-1.5", className), ...props }));
});
exports.Textarea = Textarea;
Textarea.displayName = "Textarea";
//# sourceMappingURL=textarea.js.map