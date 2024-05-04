import * as Primitives from "@radix-ui/react-tooltip";
import * as React from "react";
interface TooltipProps extends Omit<Primitives.TooltipContentProps, "content" | "onClick">, Pick<Primitives.TooltipProps, "open" | "defaultOpen" | "onOpenChange" | "delayDuration"> {
    content: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    side?: "bottom" | "left" | "top" | "right";
    maxWidth?: number;
}
/**
 * This component is based on the [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) primitive.
 *
 * @excludeExternal
 */
declare const Tooltip: ({ children, content, open, defaultOpen, onOpenChange, delayDuration, maxWidth, className, side, sideOffset, onClick, ...props }: TooltipProps) => React.JSX.Element;
export { Tooltip };
