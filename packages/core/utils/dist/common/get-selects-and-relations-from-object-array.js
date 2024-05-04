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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectsAndRelationsFromObjectArray = void 0;
var deduplicate_1 = require("./deduplicate");
var is_object_1 = require("./is-object");
function getSelectsAndRelationsFromObjectArray(dataArray, options, prefix) {
    var e_1, _a, e_2, _b;
    if (options === void 0) { options = {
        objectFields: [],
    }; }
    var selects = [];
    var relations = [];
    try {
        for (var dataArray_1 = __values(dataArray), dataArray_1_1 = dataArray_1.next(); !dataArray_1_1.done; dataArray_1_1 = dataArray_1.next()) {
            var data = dataArray_1_1.value;
            try {
                for (var _c = (e_2 = void 0, __values(Object.entries(data))), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                    if ((0, is_object_1.isObject)(value) && !options.objectFields.includes(key)) {
                        relations.push(setKey(key, prefix));
                        var res = getSelectsAndRelationsFromObjectArray([value], options, setKey(key, prefix));
                        selects.push.apply(selects, __spreadArray([], __read(res.selects), false));
                        relations.push.apply(relations, __spreadArray([], __read(res.relations), false));
                    }
                    else if (Array.isArray(value)) {
                        relations.push(setKey(key, prefix));
                        var res = getSelectsAndRelationsFromObjectArray(value, options, setKey(key, prefix));
                        selects.push.apply(selects, __spreadArray([], __read(res.selects), false));
                        relations.push.apply(relations, __spreadArray([], __read(res.relations), false));
                    }
                    else {
                        selects.push(setKey(key, prefix));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dataArray_1_1 && !dataArray_1_1.done && (_a = dataArray_1.return)) _a.call(dataArray_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var uniqueSelects = (0, deduplicate_1.deduplicate)(selects);
    var uniqueRelations = (0, deduplicate_1.deduplicate)(relations);
    return {
        selects: uniqueSelects,
        relations: uniqueRelations,
    };
}
exports.getSelectsAndRelationsFromObjectArray = getSelectsAndRelationsFromObjectArray;
function setKey(key, prefix) {
    if (prefix) {
        return "".concat(prefix, ".").concat(key);
    }
    else {
        return key;
    }
}
//# sourceMappingURL=get-selects-and-relations-from-object-array.js.map