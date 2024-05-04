"use strict";
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
exports.transformPropertiesToBigNumber = void 0;
var big_number_1 = require("./big-number");
function transformPropertiesToBigNumber(obj, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.prefix, prefix = _c === void 0 ? "raw_" : _c, _d = _b.include, include = _d === void 0 ? [] : _d, _e = _b.exclude, exclude = _e === void 0 ? [] : _e;
    var stack = [{ current: obj, path: "" }];
    var _loop_1 = function () {
        var e_1, _f;
        var _g = stack.pop(), current = _g.current, path = _g.path;
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
                for (var _h = (e_1 = void 0, __values(Object.keys(current))), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var key = _j.value;
                    var value = current[key];
                    var currentPath = path ? "".concat(path, ".").concat(key) : key;
                    if (value != null && !exclude.includes(currentPath)) {
                        if (key.startsWith(prefix)) {
                            var newKey = key.replace(prefix, "");
                            var newPath = path ? "".concat(path, ".").concat(newKey) : newKey;
                            if (!exclude.includes(newPath)) {
                                current[newKey] = new big_number_1.BigNumber(value);
                                continue;
                            }
                        }
                        else if (include.includes(currentPath)) {
                            current[key] = new big_number_1.BigNumber(value);
                            continue;
                        }
                    }
                    stack.push({ current: value, path: currentPath });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_f = _h.return)) _f.call(_h);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    while (stack.length > 0) {
        _loop_1();
    }
}
exports.transformPropertiesToBigNumber = transformPropertiesToBigNumber;
//# sourceMappingURL=transform-properties-to-bignumber.js.map