"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
function isObject(obj) {
    var _a;
    return obj != null && ((_a = obj === null || obj === void 0 ? void 0 : obj.constructor) === null || _a === void 0 ? void 0 : _a.name) === "Object";
}
exports.isObject = isObject;
//# sourceMappingURL=is-object.js.map