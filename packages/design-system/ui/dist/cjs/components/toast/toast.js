"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the [Sonner](https://sonner.emilkowal.ski/toast) toast library.
 */
const Toast = ({ 
/**
 * Optional ID of the toast.
 */
id, 
/**
 * @ignore
 *
 * @privateRemarks
 * As the Toast component is created using
 * the `toast` utility functions, the variant is inferred
 * from the utility function.
 */
variant = "info", 
/**
 * @ignore
 *
 * @privateRemarks
 * The `toast` utility functions accept this as a parameter.
 */
title, 
/**
 * The toast's text.
 */
description, 
/**
 * The toast's action buttons.
 */
action, 
/**
 * @ignore
 *
 * @privateRemarks
 * The `toast` utility functions don't allow
 * passing this prop.
 */
onDismiss, 
/**
 * The label of the dismiss button, if available.
 */
dismissLabel = "Close", }) => {
    const hasActionables = !!action || onDismiss;
    let icon = undefined;
    switch (variant) {
        case "success":
            icon = React.createElement(icons_1.CheckCircleSolid, { className: "text-ui-tag-green-icon" });
            break;
        case "warning":
            icon = React.createElement(icons_1.ExclamationCircleSolid, { className: "text-ui-tag-orange-icon" });
            break;
        case "error":
            icon = React.createElement(icons_1.XCircleSolid, { className: "text-ui-tag-red-icon" });
            break;
        case "loading":
            icon = React.createElement(icons_1.Spinner, { className: "text-ui-tag-blue-icon animate-spin" });
            break;
        case "info":
            icon = React.createElement(icons_1.InformationCircleSolid, { className: "text-ui-fg-base" });
            break;
        default:
            break;
    }
    return (React.createElement("div", { className: "shadow-elevation-flyout bg-ui-bg-base flex w-fit min-w-[360px] max-w-[440px] overflow-hidden rounded-lg" },
        React.createElement("div", { className: (0, clx_1.clx)("grid flex-1 items-start gap-3 py-3 pl-3", {
                "border-r pr-3": hasActionables,
                "pr-6": !hasActionables,
                "grid-cols-[20px_1fr]": !!icon,
                "grid-cols-1": !icon,
            }) },
            !!icon && (React.createElement("span", { className: "flex size-5 items-center justify-center", "aria-hidden": true }, icon)),
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("span", { className: "txt-compact-small-plus text-ui-fg-base" }, title),
                React.createElement("span", { className: "txt-small text-ui-fg-subtle text-pretty" }, description))),
        hasActionables && (React.createElement("div", { className: (0, clx_1.clx)("grid grid-cols-1", {
                "grid-rows-2": !!action && onDismiss,
                "grid-rows-1": !action || !onDismiss,
            }) },
            !!action && (React.createElement("button", { type: "button", className: (0, clx_1.clx)("txt-compact-small-plus text-ui-fg-base bg-ui-bg-base hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed flex items-center justify-center px-4 transition-colors", {
                    "border-ui-border-base border-b": onDismiss,
                    "text-ui-fg-error": action.variant === "destructive",
                }), onClick: action.onClick }, action.label)),
            onDismiss && (React.createElement("button", { type: "button", onClick: () => onDismiss(id), className: (0, clx_1.clx)("txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-base hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed flex items-center justify-center px-4 transition-colors") }, dismissLabel))))));
};
exports.Toast = Toast;
//# sourceMappingURL=toast.js.map