"use client";
import * as Popover from "@radix-ui/react-popover";
import * as Portal from "@radix-ui/react-portal";
import * as React from "react";
import { Kbd } from "../kbd";
import { clx } from "../../utils/clx";
/**
 * The root component of the command bar. This component manages the state of the command bar.
 */
const Root = ({ 
/**
 * Whether to open (show) the command bar.
 */
open = false, 
/**
 * Specify a function to handle the change of `open`'s value.
 */
onOpenChange, 
/**
 * Whether the command bar is open by default.
 */
defaultOpen = false, 
/**
 * Whether to disable focusing automatically on the command bar when it's opened.
 */
disableAutoFocus = true, children, }) => {
    return (React.createElement(Popover.Root, { open: open, onOpenChange: onOpenChange, defaultOpen: defaultOpen },
        React.createElement(Portal.Root, null,
            React.createElement(Popover.Anchor, { className: clx("fixed bottom-8 left-1/2 h-px w-px -translate-x-1/2") })),
        React.createElement(Popover.Portal, null,
            React.createElement(Popover.Content, { side: "top", sideOffset: 0, onOpenAutoFocus: (e) => {
                    if (disableAutoFocus) {
                        e.preventDefault();
                    }
                }, className: clx("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2") }, children))));
};
Root.displayName = "CommandBar";
/**
 * The value component of the command bar. This component is used to display a value,
 * such as the number of selected items which the commands will act on.
 */
const Value = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: clx("txt-compact-small-plus text-ui-contrast-fg-secondary px-3 py-2.5", className), ...props }));
});
Value.displayName = "CommandBar.Value";
/**
 * The bar component of the command bar. This component is used to display the commands.
 */
const Bar = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: clx("bg-ui-contrast-bg-base relative flex items-center overflow-hidden rounded-full px-1", "after:shadow-elevation-flyout after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:content-['']", className), ...props }));
});
Bar.displayName = "CommandBar.Bar";
/**
 * The seperator component of the command bar. This component is used to display a seperator between commands.
 */
const Seperator = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: clx("bg-ui-contrast-border-base h-10 w-px", className), ...props }));
});
Seperator.displayName = "CommandBar.Seperator";
/**
 * The command component of the command bar. This component is used to display a command, as well as registering the keyboad shortcut.
 */
const Command = React.forwardRef(({ className, 
/**
 * @ignore
 */
type = "button", 
/**
 * The command's label.
 */
label, 
/**
 * The function to execute when the command is triggered.
 */
action, 
/**
 * The command's shortcut
 */
shortcut, disabled, ...props }, ref) => {
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === shortcut) {
                event.preventDefault();
                event.stopPropagation();
                action();
            }
        };
        if (!disabled) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [action, shortcut, disabled]);
    return (React.createElement("button", { ref: ref, className: clx("bg-ui-contrast-bg-base txt-compact-small-plus transition-fg text-ui-contrast-fg-primary flex items-center gap-x-2 px-3 py-2.5 outline-none", "focus-visible:bg-ui-contrast-bg-highlight focus-visible:hover:bg-ui-contrast-bg-base-hover hover:bg-ui-contrast-bg-base-hover active:bg-ui-contrast-bg-base-pressed focus-visible:active:bg-ui-contrast-bg-base-pressed disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled", "last-of-type:-mr-1 last-of-type:pr-4", className), type: type, onClick: action, ...props },
        React.createElement("span", null, label),
        React.createElement(Kbd, { className: "bg-ui-contrast-bg-subtle border-ui-contrast-border-base text-ui-contrast-fg-secondary" }, shortcut.toUpperCase())));
});
Command.displayName = "CommandBar.Command";
const CommandBar = Object.assign(Root, {
    Command,
    Value,
    Bar,
    Seperator,
});
export { CommandBar };
//# sourceMappingURL=command-bar.js.map