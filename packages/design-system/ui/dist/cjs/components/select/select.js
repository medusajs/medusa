"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const SelectPrimitive = tslib_1.__importStar(require("@radix-ui/react-select"));
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const SelectContext = React.createContext(null);
const useSelectContext = () => {
    const context = React.useContext(SelectContext);
    if (context === null) {
        throw new Error("useSelectContext must be used within a SelectProvider");
    }
    return context;
};
/**
 * This component is based on [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select).
 * It also accepts all props of the HTML `select` component.
 */
const Root = ({ children, 
/**
 * The select's size.
 */
size = "base", ...props }) => {
    return (React.createElement(SelectContext.Provider, { value: React.useMemo(() => ({ size }), [size]) },
        React.createElement(SelectPrimitive.Root, { ...props }, children)));
};
Root.displayName = "Select";
/**
 * Groups multiple items together.
 */
const Group = SelectPrimitive.Group;
Group.displayName = "Select.Group";
/**
 * Displays the selected value, or a placeholder if no value is selected.
 * It's based on [Radix UI Select Value](https://www.radix-ui.com/primitives/docs/components/select#value).
 */
const Value = SelectPrimitive.Value;
Value.displayName = "Select.Value";
const triggerVariants = (0, cva_1.cva)({
    base: (0, clx_1.clx)("bg-ui-bg-field shadow-buttons-neutral transition-fg flex w-full select-none items-center justify-between rounded-md outline-none", "data-[placeholder]:text-ui-fg-muted text-ui-fg-base", "hover:bg-ui-bg-field-hover", "focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active", "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error", "invalid:border-ui-border-error invalid:shadow-borders-error", "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled", "group/trigger"),
    variants: {
        size: {
            base: "h-8 px-2 py-1.5 txt-compact-small",
            small: "h-7 px-2 py-1 txt-compact-small",
        },
    },
});
/**
 * The trigger that toggles the select.
 */
const Trigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const { size } = useSelectContext();
    return (React.createElement(SelectPrimitive.Trigger, { ref: ref, className: (0, clx_1.clx)(triggerVariants({ size }), className), ...props },
        children,
        React.createElement(SelectPrimitive.Icon, { asChild: true },
            React.createElement(icons_1.TrianglesMini, { className: "text-ui-fg-muted group-disabled/trigger:text-ui-fg-disabled" }))));
});
Trigger.displayName = "Select.Trigger";
const Content = React.forwardRef(({ className, children, position = "popper", sideOffset = 8, collisionPadding = 24, ...props }, ref) => (React.createElement(SelectPrimitive.Portal, null,
    React.createElement(SelectPrimitive.Content, { ref: ref, className: (0, clx_1.clx)("bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout relative max-h-[200px] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", {
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1": position === "popper",
        }, className), position: position, sideOffset: sideOffset, collisionPadding: collisionPadding, ...props },
        React.createElement(SelectPrimitive.Viewport, { className: (0, clx_1.clx)("p-1", position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]") }, children)))));
Content.displayName = "Select.Content";
/**
 * Used to label a group of items.
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (React.createElement(SelectPrimitive.Label, { ref: ref, className: (0, clx_1.clx)("txt-compact-xsmall-plus text-ui-fg-subtle px-3 py-2", className), ...props })));
Label.displayName = "Select.Label";
/**
 * An item in the select. It's based on [Radix UI Select Item](https://www.radix-ui.com/primitives/docs/components/select#item)
 * and accepts its props.
 */
const Item = React.forwardRef(({ className, children, ...props }, ref) => {
    const { size } = useSelectContext();
    return (React.createElement(SelectPrimitive.Item, { ref: ref, className: (0, clx_1.clx)("bg-ui-bg-base grid cursor-pointer grid-cols-[20px_1fr] gap-x-2 rounded-md px-3 py-2 outline-none transition-colors", "hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-hover", {
            "txt-compact-medium data-[state=checked]:txt-compact-medium-plus": size === "base",
            "txt-compact-small data-[state=checked]:txt-compact-medium-plus": size === "small",
        }, className), ...props },
        React.createElement("span", { className: "flex h-5 w-5 items-center justify-center" },
            React.createElement(SelectPrimitive.ItemIndicator, null,
                React.createElement(icons_1.EllipseMiniSolid, null))),
        React.createElement(SelectPrimitive.ItemText, { className: "flex-1 truncate" }, children)));
});
Item.displayName = "Select.Item";
const Separator = React.forwardRef(({ className, ...props }, ref) => (React.createElement(SelectPrimitive.Separator, { ref: ref, className: (0, clx_1.clx)("bg-ui-border-base -mx-1 my-1 h-px", className), ...props })));
Separator.displayName = "Select.Separator";
const Select = Object.assign(Root, {
    Group,
    Value,
    Trigger,
    Content,
    Label,
    Item,
    Separator,
});
exports.Select = Select;
//# sourceMappingURL=select.js.map