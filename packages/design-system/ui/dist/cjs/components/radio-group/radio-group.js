"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioGroup = void 0;
const tslib_1 = require("tslib");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-radio-group"));
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
const hint_1 = require("../hint");
const label_1 = require("../label");
/**
 * This component is based on the [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) primitives.
 */
const Root = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitives.Root, { className: (0, clx_1.clx)("grid gap-2", className), ...props, ref: ref }));
});
Root.displayName = "RadioGroup";
const Indicator = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitives.Indicator, { ref: ref, className: (0, clx_1.clx)("flex items-center justify-center", className), ...props },
        React.createElement("div", { className: (0, clx_1.clx)("bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled h-1.5 w-1.5 rounded-full group-disabled:shadow-none") })));
});
Indicator.displayName = "RadioGroup.Indicator";
const Item = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(Primitives.Item, { ref: ref, className: (0, clx_1.clx)("group relative flex h-5 w-5 items-center justify-center outline-none", className), ...props },
        React.createElement("div", { className: (0, clx_1.clx)("shadow-borders-base bg-ui-bg-base transition-fg flex h-[14px] w-[14px] items-center justify-center rounded-full", "group-hover:bg-ui-bg-base-hover", "group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow", "group-focus-visible:!shadow-borders-interactive-with-focus", "group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base") },
            React.createElement(Indicator, null))));
});
Item.displayName = "RadioGroup.Item";
const ChoiceBox = React.forwardRef(({ className, id, label, description, ...props }, ref) => {
    const generatedId = React.useId();
    if (!id) {
        id = generatedId;
    }
    const descriptionId = `${id}-description`;
    return (React.createElement(Primitives.Item, { ref: ref, className: (0, clx_1.clx)("shadow-borders-base bg-ui-bg-base focus-visible:shadow-borders-interactive-with-focus transition-fg disabled:bg-ui-bg-disabled group flex items-start gap-x-2 rounded-lg p-3 disabled:cursor-not-allowed", className), ...props, id: id, "aria-describedby": descriptionId },
        React.createElement("div", { className: "flex h-5 w-5 items-center justify-center" },
            React.createElement("div", { className: "shadow-borders-base bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow transition-fg group-disabled:!bg-ui-bg-disabled group-hover:bg-ui-bg-base-hover group-disabled:!shadow-borders-base flex h-3.5 w-3.5 items-center justify-center rounded-full" },
                React.createElement(Indicator, null))),
        React.createElement("div", { className: "flex flex-col items-start" },
            React.createElement(label_1.Label, { htmlFor: id, size: "small", weight: "plus", className: "group-disabled:text-ui-fg-disabled cursor-pointer group-disabled:cursor-not-allowed" }, label),
            React.createElement(hint_1.Hint, { className: "txt-compact-medium text-ui-fg-subtle group-disabled:text-ui-fg-disabled text-left", id: descriptionId }, description))));
});
ChoiceBox.displayName = "RadioGroup.ChoiceBox";
const RadioGroup = Object.assign(Root, { Item, ChoiceBox });
exports.RadioGroup = RadioGroup;
//# sourceMappingURL=radio-group.js.map