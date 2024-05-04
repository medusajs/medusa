"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBigNumber = void 0;
var is_object_1 = require("./is-object");
function isBigNumber(obj) {
    return (0, is_object_1.isObject)(obj) && "value" in obj;
}
exports.isBigNumber = isBigNumber;
//# sourceMappingURL=is-big-number.js.map