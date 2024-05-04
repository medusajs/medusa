"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawer = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const DrawerPrimitives = tslib_1.__importStar(require("@radix-ui/react-dialog"));
const React = tslib_1.__importStar(require("react"));
const heading_1 = require("../heading");
const icon_button_1 = require("../icon-button");
const kbd_1 = require("../kbd");
const text_1 = require("../text");
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) primitives.
 */
const DrawerRoot = (props) => {
    return React.createElement(DrawerPrimitives.Root, { ...props });
};
DrawerRoot.displayName = "Drawer";
const DrawerTrigger = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(DrawerPrimitives.Trigger, { ref: ref, className: (0, clx_1.clx)(className), ...props }));
});
DrawerTrigger.displayName = "Drawer.Trigger";
const DrawerClose = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(DrawerPrimitives.Close, { ref: ref, className: (0, clx_1.clx)(className), ...props }));
});
DrawerClose.displayName = "Drawer.Close";
const DrawerPortal = (props) => {
    return React.createElement(DrawerPrimitives.DialogPortal, { ...props });
};
DrawerPortal.displayName = "Drawer.Portal";
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(DrawerPrimitives.Overlay, { ref: ref, className: (0, clx_1.clx)("bg-ui-bg-overlay fixed inset-0", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className), ...props }));
});
DrawerOverlay.displayName = "Drawer.Overlay";
const DrawerContent = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(DrawerPortal, null,
        React.createElement(DrawerOverlay, null),
        React.createElement(DrawerPrimitives.Content, { ref: ref, className: (0, clx_1.clx)("bg-ui-bg-base shadow-elevation-modal border-ui-border-base fixed inset-y-2 flex w-full flex-1 flex-col rounded-lg border focus:outline-none max-sm:inset-x-2 max-sm:w-[calc(100%-16px)] sm:right-2 sm:max-w-[560px]", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2 duration-200", className), ...props })));
});
DrawerContent.displayName = "Drawer.Content";
const DrawerHeader = React.forwardRef(({ children, className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: "border-ui-border-base flex items-start justify-between gap-x-4 border-b px-6 py-4", ...props },
        React.createElement("div", { className: (0, clx_1.clx)("flex flex-col gap-y-1", className) }, children),
        React.createElement("div", { className: "flex items-center gap-x-2" },
            React.createElement(kbd_1.Kbd, null, "esc"),
            React.createElement(DrawerPrimitives.Close, { asChild: true },
                React.createElement(icon_button_1.IconButton, { size: "small", type: "button", variant: "transparent" },
                    React.createElement(icons_1.XMark, null))))));
});
DrawerHeader.displayName = "Drawer.Header";
const DrawerBody = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: (0, clx_1.clx)("flex-1 px-6 py-4", className), ...props }));
});
DrawerBody.displayName = "Drawer.Body";
const DrawerFooter = ({ className, ...props }) => {
    return (React.createElement("div", { className: (0, clx_1.clx)("border-ui-border-base flex items-center justify-end space-x-2 overflow-y-auto border-t px-6 py-4", className), ...props }));
};
DrawerFooter.displayName = "Drawer.Footer";
const DrawerTitle = React.forwardRef(({ className, children, ...props }, ref) => (React.createElement(DrawerPrimitives.Title, { ref: ref, className: (0, clx_1.clx)(className), asChild: true, ...props },
    React.createElement(heading_1.Heading, { level: "h1" }, children))));
DrawerTitle.displayName = "Drawer.Title";
const DrawerDescription = React.forwardRef(({ className, children, ...props }, ref) => (React.createElement(DrawerPrimitives.Description, { ref: ref, className: (0, clx_1.clx)(className), asChild: true, ...props },
    React.createElement(text_1.Text, null, children))));
DrawerDescription.displayName = "Drawer.Description";
const Drawer = Object.assign(DrawerRoot, {
    Body: DrawerBody,
    Close: DrawerClose,
    Content: DrawerContent,
    Description: DrawerDescription,
    Footer: DrawerFooter,
    Header: DrawerHeader,
    Title: DrawerTitle,
    Trigger: DrawerTrigger,
});
exports.Drawer = Drawer;
//# sourceMappingURL=drawer.js.map