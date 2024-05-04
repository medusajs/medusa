"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = void 0;
function toPascalCase(s) {
    return s.replace(/(^\w|_\w)/g, function (match) {
        return match.replace(/_/g, "").toUpperCase();
    });
}
exports.toPascalCase = toPascalCase;
//# sourceMappingURL=to-pascal-case.js.map