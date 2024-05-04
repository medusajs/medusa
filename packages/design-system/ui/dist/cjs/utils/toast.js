"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = void 0;
const tslib_1 = require("tslib");
const toast_1 = require("../components/toast");
const React = tslib_1.__importStar(require("react"));
const sonner_1 = require("sonner");
function create(variant, title, props = {}) {
    return sonner_1.toast.custom((t) => {
        return (React.createElement(toast_1.Toast, { id: props.id || t, title: title, description: props.description, onDismiss: props.dismissable ? () => sonner_1.toast.dismiss(props.id || t) : undefined, dismissLabel: props.dismissLabel, variant: variant, action: props.action }));
    }, {
        id: props.id,
        position: props.position,
        dismissible: props.dismissable,
    });
}
function message(
/**
 * The title of the toast.
 */
title, 
/**
 * The props of the toast.
 */
props = {}) {
    return create("message", title, props);
}
function info(
/**
 * The title of the toast.
 */ title, 
/**
 * The props of the toast.
 */
props = {}) {
    return create("info", title, props);
}
function error(
/**
 * The title of the toast.
 */ title, 
/**
 * The props of the toast.
 */
props = {}) {
    return create("error", title, props);
}
function success(
/**
 * The title of the toast.
 */ title, 
/**
 * The props of the toast.
 */
props = {}) {
    return create("success", title, props);
}
function warning(
/**
 * The title of the toast.
 */ title, 
/**
 * The props of the toast.
 */
props = {}) {
    return create("warning", title, props);
}
function loading(title, 
/**
 * The props of the toast.
 */
props = {}) {
    return create("loading", title, { ...props, dismissable: false });
}
function createUniqueID() {
    return Math.random().toString(36).slice(2, 8);
}
async function promise(
/**
 * The promise to be resolved.
 */
promise, 
/**
 * The props of the toast.
 */
props) {
    let id = props.id || createUniqueID();
    let shouldDismiss = id !== undefined;
    id = create("loading", typeof props.loading === "string" ? props.loading : props.loading.title, {
        id: id,
        position: props.position,
        description: typeof props.loading === "string"
            ? undefined
            : props.loading.description,
        duration: Infinity,
    });
    const p = promise instanceof Promise ? promise : promise();
    p.then(() => {
        shouldDismiss = false;
        create("success", typeof props.success === "string" ? props.success : props.success.title, {
            id: id,
            position: props.position,
            description: typeof props.success === "string"
                ? undefined
                : props.success.description,
        });
    })
        .catch(() => {
        shouldDismiss = false;
        create("error", typeof props.error === "string" ? props.error : props.error.title, {
            id: id,
            position: props.position,
            description: typeof props.error === "string"
                ? undefined
                : props.error.description,
        });
    })
        .finally(() => {
        if (shouldDismiss) {
            sonner_1.toast.dismiss(id);
            id = undefined;
        }
    });
    return id;
}
exports.toast = Object.assign(message, {
    info,
    error,
    warning,
    success,
    promise,
    loading,
    dismiss: sonner_1.toast.dismiss,
});
//# sourceMappingURL=toast.js.map