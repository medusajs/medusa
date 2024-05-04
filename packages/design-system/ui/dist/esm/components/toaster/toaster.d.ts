import * as React from "react";
import { Toaster as Primitive } from "sonner";
interface ToasterProps extends Omit<React.ComponentPropsWithoutRef<typeof Primitive>, "richColors" | "closeButton" | "icons" | "theme" | "invert" | "loadingIcon" | "cn" | "toastOptions"> {
}
/**
 * This component is based on the [Toaster component of the Sonner library](https://sonner.emilkowal.ski/toaster).
 */
declare const Toaster: ({ position, gap, offset, duration, ...props }: ToasterProps) => React.JSX.Element;
export { Toaster };
