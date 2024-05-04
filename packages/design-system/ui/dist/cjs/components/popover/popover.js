"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popover = void 0;
const tslib_1 = require("tslib");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-popover"));
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) primitves.
 */
const Root = (props) => {
    return React.createElement(Primitives.Root, { ...props });
};
Root.displayName = "Popover";
const Trigger = React.forwardRef((props, ref) => {
    return React.createElement(Primitives.Trigger, { ref: ref, ...props });
});
Trigger.displayName = "Popover.Trigger";
const Anchor = React.forwardRef((props, ref) => {
    return React.createElement(Primitives.Anchor, { ref: ref, ...props });
});
Anchor.displayName = "Popover.Anchor";
const Close = React.forwardRef((props, ref) => {
    return React.createElement(Primitives.Close, { ref: ref, ...props });
});
Close.displayName = "Popover.Close";
/**
 * @excludeExternal
 */
const Content = React.forwardRef(({ className, 
/**
 * The distance in pixels from the anchor.
 */
sideOffset = 8, 
/**
 * The preferred side of the anchor to render against when open.
 * Will be reversed when collisions occur and `avoidCollisions` is enabled.
 */
side = "bottom", 
/**
 * The preferred alignment against the anchor. May change when collisions occur.
 */
align = "start", collisionPadding, ...props }, ref) => {
    return (React.createElement(Primitives.Portal, null,
        React.createElement(Primitives.Content, { ref: ref, sideOffset: sideOffset, side: side, align: align, collisionPadding: collisionPadding, className: (0, clx_1.clx)("bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] min-w-[220px] overflow-hidden rounded-lg p-1", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className), ...props })));
});
Content.displayName = "Popover.Content";
const Seperator = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: (0, clx_1.clx)("bg-ui-border-base -mx-1 my-1 h-px", className), ...props }));
});
Seperator.displayName = "Popover.Seperator";
const Popover = Object.assign(Root, {
    Trigger,
    Anchor,
    Close,
    Content,
    Seperator,
});
exports.Popover = Popover;
//# sourceMappingURL=popover.js.map