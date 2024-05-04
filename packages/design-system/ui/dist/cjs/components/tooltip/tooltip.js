"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const tslib_1 = require("tslib");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-tooltip"));
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) primitive.
 *
 * @excludeExternal
 */
const Tooltip = ({ children, content, open, defaultOpen, onOpenChange, delayDuration, 
/**
 * The maximum width of the tooltip.
 */
maxWidth = 220, className, side, sideOffset = 8, onClick, ...props }) => {
    return (React.createElement(Primitives.Provider, { delayDuration: 100 },
        React.createElement(Primitives.Root, { open: open, defaultOpen: defaultOpen, onOpenChange: onOpenChange, delayDuration: delayDuration },
            React.createElement(Primitives.Trigger, { onClick: onClick, asChild: true }, children),
            React.createElement(Primitives.Portal, null,
                React.createElement(Primitives.Content, { side: side, sideOffset: sideOffset, align: "center", className: (0, clx_1.clx)("txt-compact-xsmall text-ui-fg-subtle bg-ui-bg-base shadow-elevation-tooltip rounded-lg px-2.5 py-1", "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className), ...props, style: { ...props.style, maxWidth } }, content)))));
};
exports.Tooltip = Tooltip;
//# sourceMappingURL=tooltip.js.map