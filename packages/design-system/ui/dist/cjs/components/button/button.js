"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonVariants = exports.Button = void 0;
const tslib_1 = require("tslib");
const react_slot_1 = require("@radix-ui/react-slot");
const cva_1 = require("cva");
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const icons_1 = require("@medusajs/icons");
const buttonVariants = (0, cva_1.cva)({
    base: (0, clx_1.clx)("transition-fg relative inline-flex w-fit items-center justify-center overflow-hidden rounded-md outline-none", "disabled:bg-ui-bg-disabled disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden", "after:transition-fg after:absolute after:inset-0 after:content-['']"),
    variants: {
        variant: {
            primary: (0, clx_1.clx)("shadow-buttons-inverted text-ui-fg-on-inverted bg-ui-button-inverted after:button-inverted-gradient", "hover:bg-ui-button-inverted-hover hover:after:button-inverted-hover-gradient", "active:bg-ui-button-inverted-pressed active:after:button-inverted-pressed-gradient", "focus-visible:!shadow-buttons-inverted-focus"),
            secondary: (0, clx_1.clx)("shadow-buttons-neutral text-ui-fg-base bg-ui-button-neutral after:button-neutral-gradient", "hover:bg-ui-button-neutral-hover hover:after:button-neutral-hover-gradient", "active:bg-ui-button-neutral-pressed active:after:button-neutral-pressed-gradient", "focus-visible:shadow-buttons-neutral-focus"),
            transparent: (0, clx_1.clx)("after:hidden", "text-ui-fg-base bg-ui-button-transparent", "hover:bg-ui-button-transparent-hover", "active:bg-ui-button-transparent-pressed", "focus-visible:shadow-buttons-neutral-focus focus-visible:bg-ui-bg-base", "disabled:!bg-transparent disabled:!shadow-none"),
            danger: (0, clx_1.clx)("shadow-buttons-colored shadow-buttons-danger text-ui-fg-on-color bg-ui-button-danger after:button-danger-gradient", "hover:bg-ui-button-danger-hover hover:after:button-danger-hover-gradient", "active:bg-ui-button-danger-pressed active:after:button-danger-pressed-gradient", "focus-visible:shadow-buttons-danger-focus"),
        },
        size: {
            small: "txt-compact-small-plus gap-x-1 px-2 py-1",
            base: "txt-compact-small-plus gap-x-1.5 px-3 py-1.5",
            large: "txt-compact-medium-plus gap-x-1.5 px-4 py-2.5",
            xlarge: "txt-compact-large-plus gap-x-1.5 px-5 py-3.5",
        },
    },
    defaultVariants: {
        size: "base",
        variant: "primary",
    },
});
exports.buttonVariants = buttonVariants;
/**
 * This component is based on the `button` element and supports all of its props
 */
const Button = React.forwardRef(({ 
/**
 * The button's style.
 */
variant = "primary", 
/**
 * The button's size.
 */
size = "base", className, 
/**
 * Whether to remove the wrapper `button` element and use the
 * passed child element instead.
 */
asChild = false, children, 
/**
 * Whether to show a loading spinner.
 */
isLoading = false, disabled, ...props }, ref) => {
    const Component = asChild ? react_slot_1.Slot : "button";
    /**
     * In the case of a button where asChild is true, and isLoading is true, we ensure that
     * only on element is passed as a child to the Slot component. This is because the Slot
     * component only accepts a single child.
     */
    const renderInner = () => {
        if (isLoading) {
            return (React.createElement("span", { className: "pointer-events-none" },
                React.createElement("div", { className: (0, clx_1.clx)("bg-ui-bg-disabled absolute inset-0 flex items-center justify-center rounded-md") },
                    React.createElement(icons_1.Spinner, { className: "animate-spin" })),
                children));
        }
        return children;
    };
    return (React.createElement(Component, { ref: ref, ...props, className: (0, clx_1.clx)(buttonVariants({ variant, size }), className), disabled: disabled || isLoading }, renderInner()));
});
exports.Button = Button;
Button.displayName = "Button";
//# sourceMappingURL=button.js.map