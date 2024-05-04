"use client";
import { XMark } from "@medusajs/icons";
import * as FocusModalPrimitives from "@radix-ui/react-dialog";
import * as React from "react";
import { IconButton } from "../icon-button";
import { Kbd } from "../kbd";
import { clx } from "../../utils/clx";
/**
 * This component is based on the [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) primitives.
 */
const FocusModalRoot = (props) => {
    return React.createElement(FocusModalPrimitives.Root, { ...props });
};
FocusModalRoot.displayName = "FocusModal";
const FocusModalTrigger = React.forwardRef((props, ref) => {
    return React.createElement(FocusModalPrimitives.Trigger, { ref: ref, ...props });
});
FocusModalTrigger.displayName = "FocusModal.Trigger";
const FocusModalClose = FocusModalPrimitives.Close;
FocusModalClose.displayName = "FocusModal.Close";
const FocusModalPortal = ({ className, ...props }) => {
    return (React.createElement(FocusModalPrimitives.DialogPortal, { className: clx(className), ...props }));
};
FocusModalPortal.displayName = "FocusModal.Portal";
const FocusModalOverlay = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(FocusModalPrimitives.Overlay, { ref: ref, className: clx("bg-ui-bg-overlay fixed inset-0", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className), ...props }));
});
FocusModalOverlay.displayName = "FocusModal.Overlay";
const FocusModalContent = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(FocusModalPortal, null,
        React.createElement(FocusModalOverlay, null),
        React.createElement(FocusModalPrimitives.Content, { ref: ref, className: clx("bg-ui-bg-base shadow-elevation-modal fixed inset-2 flex flex-col overflow-hidden rounded-lg border focus-visible:outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-0 data-[state=closed]:slide-in-from-bottom-2  duration-200", className), ...props })));
});
FocusModalContent.displayName = "FocusModal.Content";
/**
 * This component is based on the `div` element and supports all of its props
 */
const FocusModalHeader = React.forwardRef(({ children, className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: clx("border-ui-border-base flex items-center justify-between gap-x-4 border-b px-4 py-2", className), ...props },
        React.createElement("div", { className: "flex items-center gap-x-2" },
            React.createElement(FocusModalPrimitives.Close, { asChild: true },
                React.createElement(IconButton, { size: "small", type: "button", variant: "transparent" },
                    React.createElement(XMark, null))),
            React.createElement(Kbd, null, "esc")),
        children));
});
FocusModalHeader.displayName = "FocusModal.Header";
/**
 * This component is based on the `div` element and supports all of its props
 */
const FocusModalBody = React.forwardRef(({ className, ...props }, ref) => {
    return React.createElement("div", { ref: ref, className: clx("flex-1", className), ...props });
});
FocusModalBody.displayName = "FocusModal.Body";
const FocusModal = Object.assign(FocusModalRoot, {
    Trigger: FocusModalTrigger,
    Content: FocusModalContent,
    Header: FocusModalHeader,
    Body: FocusModalBody,
    Close: FocusModalClose,
});
export { FocusModal };
//# sourceMappingURL=focus-modal.js.map