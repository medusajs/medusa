"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clx = void 0;
const tslib_1 = require("tslib");
const clsx_1 = tslib_1.__importDefault(require("clsx"));
const tailwind_merge_1 = require("tailwind-merge");
function clx(...args) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.default)(...args));
}
exports.clx = clx;
//# sourceMappingURL=clx.js.map