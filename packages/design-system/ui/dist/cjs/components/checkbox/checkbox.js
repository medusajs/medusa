"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkbox = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const Primitives = tslib_1.__importStar(require("@radix-ui/react-checkbox"));
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) primitive.
 */
const Checkbox = React.forwardRef(({ className, checked, ...props }, ref) => {
    return (React.createElement(Primitives.Root, { ...props, ref: ref, checked: checked, className: (0, clx_1.clx)("group relative inline-flex h-5 w-5 items-center justify-center outline-none ", className) },
        React.createElement("div", { className: "text-ui-fg-on-inverted bg-ui-bg-base shadow-borders-base group-hover:bg-ui-bg-base-hover group-focus-visible:!shadow-borders-interactive-with-focus group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive-with-shadow group-data-[state=indeterminate]:bg-ui-bg-interactive group-data-[state=indeterminate]:shadow-borders-interactive-with-shadow [&_path]:shadow-details-contrast-on-bg-interactive group-disabled:text-ui-fg-disabled group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base transition-fg h-[14px] w-[14px] rounded-[3px]" },
            React.createElement(Primitives.Indicator, { className: "absolute inset-0" }, checked === "indeterminate" ? React.createElement(icons_1.MinusMini, null) : React.createElement(icons_1.CheckMini, null)))));
});
exports.Checkbox = Checkbox;
Checkbox.displayName = "Checkbox";
//# sourceMappingURL=checkbox.js.map