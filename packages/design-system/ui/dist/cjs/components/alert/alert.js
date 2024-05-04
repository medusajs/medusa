"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
const tslib_1 = require("tslib");
const clx_1 = require("../../utils/clx");
const icons_1 = require("@medusajs/icons");
const React = tslib_1.__importStar(require("react"));
const icon_button_1 = require("../icon-button");
/**
 * This component is based on the div element and supports all of its props
 *
 * @excludeExternal
 */
exports.Alert = React.forwardRef(({ 
/**
 * The variant of the alert
 */
variant = "info", 
/**
 * Whether the alert is dismissible
 */
dismissible = false, className, children, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false);
    const Icon = {
        info: icons_1.InformationCircleSolid,
        error: icons_1.XCircleSolid,
        success: icons_1.CheckCircleSolid,
        warning: icons_1.ExclamationCircleSolid,
    }[variant];
    const handleDismiss = () => {
        setDismissed(true);
    };
    if (dismissed) {
        return null;
    }
    return (React.createElement("div", { ref: ref, className: (0, clx_1.clx)("bg-ui-bg-subtle text-pretty txt-compact-small grid items-start gap-x-3 rounded-lg border p-3", {
            "grid-cols-[20px_1fr]": !dismissible,
            "grid-cols-[20px_1fr_20px]": dismissible,
        }, className), ...props },
        React.createElement(Icon, { className: (0, clx_1.clx)({
                "text-ui-tag-red-icon": variant === "error",
                "text-ui-tag-green-icon": variant === "success",
                "text-ui-tag-orange-icon": variant === "warning",
                "text-ui-tag-neutral-icon": variant === "info",
            }) }),
        React.createElement("div", null, children),
        dismissible && (React.createElement(icon_button_1.IconButton, { size: "2xsmall", variant: "transparent", type: "button", onClick: handleDismiss },
            React.createElement(icons_1.XMarkMini, { className: "text-ui-fg-muted" })))));
});
//# sourceMappingURL=alert.js.map