"use client";
import * as Primitives from "@radix-ui/react-radio-group";
import * as React from "react";
import { clx } from "../../utils/clx";
import { Hint } from "../hint";
import { Label } from "../label";
/**
 * This component is based on the [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) primitives.
 */
const Root = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitives.Root, { className: clx("grid gap-2", className), ...props, ref: ref }));
});
Root.displayName = "RadioGroup";
const Indicator = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitives.Indicator, { ref: ref, className: clx("flex items-center justify-center", className), ...props },
        React.createElement("div", { className: clx("bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled h-1.5 w-1.5 rounded-full group-disabled:shadow-none") })));
});
Indicator.displayName = "RadioGroup.Indicator";
const Item = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitives.Item, { ref: ref, className: clx("group relative flex h-5 w-5 items-center justify-center outline-none", className), ...props },
        React.createElement("div", { className: clx("shadow-borders-base bg-ui-bg-base transition-fg flex h-[14px] w-[14px] items-center justify-center rounded-full", "group-hover:bg-ui-bg-base-hover", "group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow", "group-focus-visible:!shadow-borders-interactive-with-focus", "group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base") },
            React.createElement(Indicator, null))));
});
Item.displayName = "RadioGroup.Item";
const ChoiceBox = React.forwardRef(({ className, id, label, description, ...props }, ref) => {
    const generatedId = React.useId();
    if (!id) {
        id = generatedId;
    }
    const descriptionId = `${id}-description`;
    return (React.createElement(Primitives.Item, { ref: ref, className: clx("shadow-borders-base bg-ui-bg-base focus-visible:shadow-borders-interactive-with-focus transition-fg disabled:bg-ui-bg-disabled group flex items-start gap-x-2 rounded-lg p-3 disabled:cursor-not-allowed", className), ...props, id: id, "aria-describedby": descriptionId },
        React.createElement("div", { className: "flex h-5 w-5 items-center justify-center" },
            React.createElement("div", { className: "shadow-borders-base bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow transition-fg group-disabled:!bg-ui-bg-disabled group-hover:bg-ui-bg-base-hover group-disabled:!shadow-borders-base flex h-3.5 w-3.5 items-center justify-center rounded-full" },
                React.createElement(Indicator, null))),
        React.createElement("div", { className: "flex flex-col items-start" },
            React.createElement(Label, { htmlFor: id, size: "small", weight: "plus", className: "group-disabled:text-ui-fg-disabled cursor-pointer group-disabled:cursor-not-allowed" }, label),
            React.createElement(Hint, { className: "txt-compact-medium text-ui-fg-subtle group-disabled:text-ui-fg-disabled text-left", id: descriptionId }, description))));
});
ChoiceBox.displayName = "RadioGroup.ChoiceBox";
const RadioGroup = Object.assign(Root, { Item, ChoiceBox });
export { RadioGroup };
//# sourceMappingURL=radio-group.js.map