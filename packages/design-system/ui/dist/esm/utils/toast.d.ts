import { ToastAction, ToasterPosition } from "../types";
interface BaseToastProps {
    id?: string | number;
    position?: ToasterPosition;
    dismissable?: boolean;
    dismissLabel?: string;
    duration?: number;
}
interface ToastProps extends BaseToastProps {
    description?: string;
    action?: ToastAction;
}
declare function message(
/**
 * The title of the toast.
 */
title: string, 
/**
 * The props of the toast.
 */
props?: ToastProps): string | number;
declare function info(
/**
 * The title of the toast.
 */ title: string, 
/**
 * The props of the toast.
 */
props?: ToastProps): string | number;
declare function error(
/**
 * The title of the toast.
 */ title: string, 
/**
 * The props of the toast.
 */
props?: ToastProps): string | number;
declare function success(
/**
 * The title of the toast.
 */ title: string, 
/**
 * The props of the toast.
 */
props?: ToastProps): string | number;
declare function warning(
/**
 * The title of the toast.
 */ title: string, 
/**
 * The props of the toast.
 */
props?: ToastProps): string | number;
declare function loading(title: string, 
/**
 * The props of the toast.
 */
props?: ToastProps): string | number;
type PromiseStateProps = string | {
    title: string;
    description?: string;
};
interface PromiseToastProps extends BaseToastProps {
    loading: PromiseStateProps;
    success: PromiseStateProps;
    error: PromiseStateProps;
}
declare function promise<TData>(
/**
 * The promise to be resolved.
 */
promise: Promise<TData> | (() => Promise<TData>), 
/**
 * The props of the toast.
 */
props: PromiseToastProps): Promise<string | number>;
export declare const toast: typeof message & {
    info: typeof info;
    error: typeof error;
    warning: typeof warning;
    success: typeof success;
    promise: typeof promise;
    loading: typeof loading;
    dismiss: (id?: string | number | undefined) => string | number;
};
export {};
