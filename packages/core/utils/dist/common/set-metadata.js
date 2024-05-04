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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMetadata = void 0;
var errors_1 = require("./errors");
/**
 * Dedicated method to set metadata.
 * @param obj - the entity to apply metadata to.
 * @param metadata - the metadata to set
 * @return resolves to the updated result.
 */
function setMetadata(obj, metadata) {
    var e_1, _a;
    var existing = obj.metadata || {};
    var newData = {};
    try {
        for (var _b = __values(Object.entries(metadata)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
            if (typeof key !== "string") {
                throw new errors_1.MedusaError(errors_1.MedusaError.Types.INVALID_ARGUMENT, "Key type is invalid. Metadata keys must be strings");
            }
            /**
             * We reserve the empty string as a way to delete a key.
             * If the value is an empty string, we don't
             * set it, and if it exists in the existing metadata, we
             * unset the field.
             */
            if (value === "") {
                if (key in existing) {
                    delete existing[key];
                }
                continue;
            }
            newData[key] = value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return __assign(__assign({}, existing), newData);
}
exports.setMetadata = setMetadata;
//# sourceMappingURL=set-metadata.js.map