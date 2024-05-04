"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copy = void 0;
const tslib_1 = require("tslib");
const tooltip_1 = require("../tooltip");
const clx_1 = require("../../utils/clx");
const icons_1 = require("@medusajs/icons");
const react_slot_1 = require("@radix-ui/react-slot");
const copy_to_clipboard_1 = tslib_1.__importDefault(require("copy-to-clipboard"));
const react_1 = tslib_1.__importStar(require("react"));
/**
 * This component is based on the `button` element and supports all of its props
 */
const Copy = react_1.default.forwardRef(({ children, className, 
/**
 * The content to copy.
 */
content, 
/**
 * The variant of the copy button.
 */
variant = "default", 
/**
 * Whether to remove the wrapper `button` element and use the
 * passed child element instead.
 */
asChild = false, ...props }, ref) => {
    const [done, setDone] = (0, react_1.useState)(false);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [text, setText] = (0, react_1.useState)("Copy");
    const copyToClipboard = (e) => {
        e.stopPropagation();
        setDone(true);
        (0, copy_to_clipboard_1.default)(content);
        setTimeout(() => {
            setDone(false);
        }, 2000);
    };
    react_1.default.useEffect(() => {
        if (done) {
            setText("Copied");
            return;
        }
        setTimeout(() => {
            setText("Copy");
        }, 500);
    }, [done]);
    const isDefaultVariant = (variant) => {
        return variant === "default";
    };
    const isDefault = isDefaultVariant(variant);
    const Component = asChild ? react_slot_1.Slot : "button";
    return (react_1.default.createElement(tooltip_1.Tooltip, { content: text, open: done || open, onOpenChange: setOpen },
        react_1.default.createElement(Component, { ref: ref, "aria-label": "Copy code snippet", type: "button", className: (0, clx_1.clx)("text-ui-code-icon h-fit w-fit", className), onClick: copyToClipboard, ...props }, children ? (children) : done ? (isDefault ? (react_1.default.createElement(icons_1.CheckCircleSolid, null)) : (react_1.default.createElement(icons_1.CheckCircleMiniSolid, null))) : isDefault ? (react_1.default.createElement(icons_1.SquareTwoStack, null)) : (react_1.default.createElement(icons_1.SquareTwoStackMini, null)))));
});
exports.Copy = Copy;
Copy.displayName = "Copy";
//# sourceMappingURL=copy.js.map