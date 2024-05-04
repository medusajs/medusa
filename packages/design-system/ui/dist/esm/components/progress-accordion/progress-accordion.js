"use client";
import { CheckCircleSolid, CircleDottedLine, CircleHalfSolid, Plus, } from "@medusajs/icons";
import * as Primitves from "@radix-ui/react-accordion";
import * as React from "react";
import { clx } from "../../utils/clx";
import { IconButton } from "../icon-button";
/**
 * This component is based on the [Radix UI Accordion](https://radix-ui.com/primitives/docs/components/accordion) primitves.
 */
const Root = (props) => {
    return React.createElement(Primitves.Root, { ...props });
};
Root.displayName = "ProgressAccordion";
const Item = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitves.Item, { ref: ref, className: clx("border-ui-border-base border-b last-of-type:border-b-0", className), ...props }));
});
Item.displayName = "ProgressAccordion.Item";
const ProgressIndicator = ({ 
/**
 * The current status.
 */
status, ...props }) => {
    const Icon = React.useMemo(() => {
        switch (status) {
            case "not-started":
                return CircleDottedLine;
            case "in-progress":
                return CircleHalfSolid;
            case "completed":
                return CheckCircleSolid;
            default:
                return CircleDottedLine;
        }
    }, [status]);
    return (React.createElement("span", { className: "text-ui-fg-muted group-data-[state=open]:text-ui-fg-interactive flex h-12 w-12 items-center justify-center", ...props },
        React.createElement(Icon, null)));
};
ProgressIndicator.displayName = "ProgressAccordion.ProgressIndicator";
const Header = React.forwardRef(({ className, 
/**
 * The current status.
 */
status = "not-started", children, ...props }, ref) => {
    return (React.createElement(Primitves.Header, { ref: ref, className: clx("h3-core text-ui-fg-base group flex w-full flex-1 items-center gap-4 px-6", className), ...props },
        React.createElement(ProgressIndicator, { status: status }),
        children,
        React.createElement(Primitves.Trigger, { asChild: true, className: "ml-auto" },
            React.createElement(IconButton, { variant: "transparent" },
                React.createElement(Plus, { className: "transform transition-transform group-data-[state=open]:rotate-45" })))));
});
Header.displayName = "ProgressAccordion.Header";
const Content = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitves.Content, { ref: ref, className: clx("overflow-hidden", "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pl-[88px] pr-6", className), ...props }));
});
Content.displayName = "ProgressAccordion.Content";
const ProgressAccordion = Object.assign(Root, {
    Item,
    Header,
    Content,
});
export { ProgressAccordion };
//# sourceMappingURL=progress-accordion.js.map