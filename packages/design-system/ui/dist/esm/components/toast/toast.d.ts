import * as React from "react";
import type { ToastAction, ToastVariant } from "../../types";
interface ToastComponentProps {
    id: string | number;
    variant?: ToastVariant;
    title: string;
    description?: string;
    action?: ToastAction;
    onDismiss?: (id?: string | number) => void;
    dismissLabel?: string;
}
/**
 * This component is based on the [Sonner](https://sonner.emilkowal.ski/toast) toast library.
 */
export declare const Toast: ({ id, variant, title, description, action, onDismiss, dismissLabel, }: ToastComponentProps) => React.JSX.Element;
export {};
