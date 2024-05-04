import { clx } from "../../utils/clx";
import { CheckCircleSolid, ExclamationCircleSolid, InformationCircleSolid, XCircleSolid, XMarkMini, } from "@medusajs/icons";
import * as React from "react";
import { IconButton } from "../icon-button";
/**
 * This component is based on the div element and supports all of its props
 *
 * @excludeExternal
 */
export const Alert = React.forwardRef(({ 
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
        info: InformationCircleSolid,
        error: XCircleSolid,
        success: CheckCircleSolid,
        warning: ExclamationCircleSolid,
    }[variant];
    const handleDismiss = () => {
        setDismissed(true);
    };
    if (dismissed) {
        return null;
    }
    return (React.createElement("div", { ref: ref, className: clx("bg-ui-bg-subtle text-pretty txt-compact-small grid items-start gap-x-3 rounded-lg border p-3", {
            "grid-cols-[20px_1fr]": !dismissible,
            "grid-cols-[20px_1fr_20px]": dismissible,
        }, className), ...props },
        React.createElement(Icon, { className: clx({
                "text-ui-tag-red-icon": variant === "error",
                "text-ui-tag-green-icon": variant === "success",
                "text-ui-tag-orange-icon": variant === "warning",
                "text-ui-tag-neutral-icon": variant === "info",
            }) }),
        React.createElement("div", null, children),
        dismissible && (React.createElement(IconButton, { size: "2xsmall", variant: "transparent", type: "button", onClick: handleDismiss },
            React.createElement(XMarkMini, { className: "text-ui-fg-muted" })))));
});
//# sourceMappingURL=alert.js.map