"use client";
import * as React from "react";
import { Toaster as Primitive } from "sonner";
import { clx } from "../../utils/clx";
/**
 * This component is based on the [Toaster component of the Sonner library](https://sonner.emilkowal.ski/toaster).
 */
const Toaster = ({ 
/**
 * The position of the created toasts.
 */
position = "bottom-right", 
/**
 * The gap between the toast components.
 */
gap = 12, 
/**
 * The space from the edges of the screen.
 */
offset = 24, 
/**
 * The time in milliseconds that a toast is shown before it's
 * automatically dismissed.
 *
 * @defaultValue 4000
 */
duration, ...props }) => {
    return (React.createElement(Primitive, { position: position, gap: gap, offset: offset, cn: clx, toastOptions: {
            duration,
        }, ...props }));
};
export { Toaster };
//# sourceMappingURL=toaster.js.map