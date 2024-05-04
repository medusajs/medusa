"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnakeCase = void 0;
var camelToSnakeCase = function (string) {
    return string.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
};
exports.camelToSnakeCase = camelToSnakeCase;
//# sourceMappingURL=camel-to-snake-case.js.map