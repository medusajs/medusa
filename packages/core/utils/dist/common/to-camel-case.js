"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = void 0;
function toCamelCase(str) {
    return /^([a-z]+)(([A-Z]([a-z]+))+)$/.test(str)
        ? str
        : str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, function (m, chr) { return chr.toUpperCase(); });
}
exports.toCamelCase = toCamelCase;
//# sourceMappingURL=to-camel-case.js.map