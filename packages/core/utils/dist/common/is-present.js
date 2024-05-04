"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPresent = void 0;
var is_defined_1 = require("./is-defined");
var is_object_1 = require("./is-object");
var is_string_1 = require("./is-string");
function isPresent(value) {
    if (!(0, is_defined_1.isDefined)(value) || value === null) {
        return false;
    }
    if ((0, is_string_1.isString)(value) || Array.isArray(value)) {
        return value.length > 0;
    }
    if (value instanceof Map || value instanceof Set) {
        return value.size > 0;
    }
    if ((0, is_object_1.isObject)(value)) {
        return Object.keys(value).length > 0;
    }
    return true;
}
exports.isPresent = isPresent;
//# sourceMappingURL=is-present.js.map