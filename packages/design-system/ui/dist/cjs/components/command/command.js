"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const tslib_1 = require("tslib");
const copy_1 = require("../copy");
const clx_1 = require("../../utils/clx");
const react_1 = tslib_1.__importDefault(require("react"));
/**
 * This component is based on the div element and supports all of its props
 */
const CommandComponent = ({ className, ...props }) => {
    return (react_1.default.createElement("div", { className: (0, clx_1.clx)("bg-ui-code-bg-base border-ui-code-border flex items-center rounded-lg border px-3 py-2", "[&>code]:text-ui-code-fg-base [&>code]:code-body [&>code]:mx-3", className), ...props }));
};
CommandComponent.displayName = "Command";
const CommandCopy = react_1.default.forwardRef(({ className, ...props }, ref) => {
    return (react_1.default.createElement(copy_1.Copy, { ...props, ref: ref, className: (0, clx_1.clx)("!text-ui-code-fg-muted ml-auto", className) }));
});
CommandCopy.displayName = "Command.Copy";
const Command = Object.assign(CommandComponent, { Copy: CommandCopy });
exports.Command = Command;
//# sourceMappingURL=command.js.map