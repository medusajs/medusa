"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTabs = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const ProgressTabsPrimitives = tslib_1.__importStar(require("@radix-ui/react-tabs"));
const React = tslib_1.__importStar(require("react"));
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the [Radix UI Tabs](https://radix-ui.com/primitives/docs/components/tabs) primitves.
 *
 * @excludeExternal
 */
const ProgressTabsRoot = (props) => {
    return React.createElement(ProgressTabsPrimitives.Root, { ...props });
};
ProgressTabsRoot.displayName = "ProgressTabs";
const ProgressIndicator = ({ status, className, ...props }) => {
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
    return (React.createElement("span", { className: (0, clx_1.clx)("text-ui-fg-muted group-data-[state=active]/trigger:text-ui-fg-interactive", className), ...props },
        React.createElement(Icon, null)));
};
ProgressIndicator.displayName = "ProgressTabs.ProgressIndicator";
const ProgressTabsTrigger = React.forwardRef(({ className, children, status = "not-started", ...props }, ref) => (React.createElement(ProgressTabsPrimitives.Trigger, { ref: ref, className: (0, clx_1.clx)("txt-compact-small-plus transition-fg text-ui-fg-muted bg-ui-bg-subtle border-r-ui-border-base inline-flex h-14 w-full max-w-[200px] flex-1 items-center gap-x-2 border-r px-4 text-left outline-none", "group/trigger overflow-hidden text-ellipsis whitespace-nowrap", "disabled:bg-ui-bg-disabled disabled:text-ui-fg-muted", "hover:bg-ui-bg-subtle-hover", "focus-visible:bg-ui-bg-base focus:z-[1]", "data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base", className), ...props },
    React.createElement(ProgressIndicator, { status: status }),
    children)));
ProgressTabsTrigger.displayName = "ProgressTabs.Trigger";
const ProgressTabsList = React.forwardRef(({ className, ...props }, ref) => (React.createElement(ProgressTabsPrimitives.List, { ref: ref, className: (0, clx_1.clx)("flex items-center", className), ...props })));
ProgressTabsList.displayName = "ProgressTabs.List";
const ProgressTabsContent = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement(ProgressTabsPrimitives.Content, { ref: ref, className: (0, clx_1.clx)("outline-none", className), ...props }));
});
ProgressTabsContent.displayName = "ProgressTabs.Content";
const ProgressTabs = Object.assign(ProgressTabsRoot, {
    Trigger: ProgressTabsTrigger,
    List: ProgressTabsList,
    Content: ProgressTabsContent,
});
exports.ProgressTabs = ProgressTabs;
//# sourceMappingURL=progress-tabs.js.map