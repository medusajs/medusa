import React from "react";
/**
 * This component is based on the `button` element and supports all of its props
 */
declare const Copy: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLButtonElement> & {
    content: string;
    variant?: "default" | "mini" | null | undefined;
    asChild?: boolean | undefined;
} & React.RefAttributes<HTMLButtonElement>>;
export { Copy };
