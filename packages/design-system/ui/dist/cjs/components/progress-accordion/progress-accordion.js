"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressAccordion = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const Primitves = tslib_1.__importStar(require("@radix-ui/react-accordion"));
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const icon_button_1 = require("../icon-button");
/**
 * This component is based on the [Radix UI Accordion](https://radix-ui.com/primitives/docs/components/accordion) primitves.
 */
const Root = (props) => {
    return React.createElement(Primitves.Root, { ...props });
};
Root.displayName = "ProgressAccordion";
const Item = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitves.Item, { ref: ref, className: (0, clx_1.clx)("border-ui-border-base border-b last-of-type:border-b-0", className), ...props }));
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
                return icons_1.CircleDottedLine;
            case "in-progress":
                return icons_1.CircleHalfSolid;
            case "completed":
                return icons_1.CheckCircleSolid;
            default:
                return icons_1.CircleDottedLine;
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
    return (React.createElement(Primitves.Header, { ref: ref, className: (0, clx_1.clx)("h3-core text-ui-fg-base group flex w-full flex-1 items-center gap-4 px-6", className), ...props },
        React.createElement(ProgressIndicator, { status: status }),
        children,
        React.createElement(Primitves.Trigger, { asChild: true, className: "ml-auto" },
            React.createElement(icon_button_1.IconButton, { variant: "transparent" },
                React.createElement(icons_1.Plus, { className: "transform transition-transform group-data-[state=open]:rotate-45" })))));
});
Header.displayName = "ProgressAccordion.Header";
const Content = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitves.Content, { ref: ref, className: (0, clx_1.clx)("overflow-hidden", "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pl-[88px] pr-6", className), ...props }));
});
Content.displayName = "ProgressAccordion.Content";
const ProgressAccordion = Object.assign(Root, {
    Item,
    Header,
    Content,
});
exports.ProgressAccordion = ProgressAccordion;
//# sourceMappingURL=progress-accordion.js.map