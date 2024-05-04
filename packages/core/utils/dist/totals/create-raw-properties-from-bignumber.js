"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRawPropertiesFromBigNumber = void 0;
var common_1 = require("../common");
var big_number_1 = require("./big-number");
function createRawPropertiesFromBigNumber(obj, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? "raw_" : _c, _d = _b.exclude, exclude = _d === void 0 ? [] : _d;
    var stack = [{ current: obj, path: "" }];
    var _loop_1 = function () {
        var e_1, _e;
        var _f = stack.pop(), current = _f.current, path = _f.path;
        if (current == null ||
            typeof current !== "object" ||
            current instanceof big_number_1.BigNumber) {
            return "continue";
        }
        if (Array.isArray(current)) {
            current.forEach(function (element, index) {
                return stack.push({ current: element, path: path });
            });
        }
        else {
            try {
                for (var _g = (e_1 = void 0, __values(Object.keys(current))), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var key = _h.value;
                    var value = current[key];
                    var currentPath = path ? "".concat(path, ".").concat(key) : key;
                    if (value != null && !exclude.includes(currentPath)) {
                        var isBigNumber = typeof value === "object" &&
                            (0, common_1.isDefined)(value.raw_) &&
                            (0, common_1.isDefined)(value.numeric_);
                        if (isBigNumber) {
                            var newKey = prefix + key;
                            var newPath = path ? "".concat(path, ".").concat(newKey) : newKey;
                            if (!exclude.includes(newPath)) {
                                current[newKey] = __assign(__assign({}, value.raw_), { value: (0, common_1.trimZeros)(value.raw_.value) });
                                continue;
                            }
                        }
                    }
                    stack.push({ current: value, path: currentPath });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_e = _g.return)) _e.call(_g);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    while (stack.length > 0) {
        _loop_1();
    }
}
exports.createRawPropertiesFromBigNumber = createRawPropertiesFromBigNumber;
//# sourceMappingURL=create-raw-properties-from-bignumber.js.map