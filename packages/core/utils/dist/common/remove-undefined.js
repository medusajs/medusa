"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = void 0;
// useful in cases where presence of undefined is not desired (eg. in microORM operations)
var removeUndefined = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};
exports.removeUndefined = removeUndefined;
//# sourceMappingURL=remove-undefined.js.map