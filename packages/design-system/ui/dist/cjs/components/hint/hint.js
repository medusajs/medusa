"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hint = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const hintVariants = (0, cva_1.cva)({
    base: "txt-small",
    variants: {
        variant: {
            info: "text-ui-fg-subtle",
            error: "text-ui-fg-error grid grid-cols-[20px_1fr] gap-2 items-start",
        },
    },
    defaultVariants: {
        variant: "info",
    },
});
const Hint = React.forwardRef(({ className, 
/**
 * The hint's style.
 */
variant = "info", children, ...props }, ref) => {
    return (React.createElement("span", { ref: ref, className: (0, clx_1.clx)(hintVariants({ variant }), className), ...props },
        variant === "error" && React.createElement(icons_1.ExclamationCircleSolid, null),
        children));
});
exports.Hint = Hint;
Hint.displayName = "Hint";
//# sourceMappingURL=hint.js.map