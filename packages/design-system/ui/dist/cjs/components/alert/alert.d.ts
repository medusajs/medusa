import * as React from "react";
interface AlertProps extends React.ComponentPropsWithoutRef<"div"> {
    variant?: "error" | "success" | "warning" | "info";
    dismissible?: boolean;
}
/**
 * This component is based on the div element and supports all of its props
 *
 * @excludeExternal
 */
export declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
export {};
