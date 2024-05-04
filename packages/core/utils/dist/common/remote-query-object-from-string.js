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
exports.remoteQueryObjectFromString = void 0;
var is_object_1 = require("./is-object");
/**
 * Convert a string fields array to a remote query object
 * @param config - The configuration object
 *
 * @example
 * const fields = [
 *   "id",
 *   "created_at",
 *   "updated_at",
 *   "deleted_at",
 *   "url",
 *   "metadata",
 *   "tags.id",
 *   "tags.created_at",
 *   "tags.updated_at",
 *   "tags.deleted_at",
 *   "tags.value",
 *   "options.id",
 *   "options.created_at",
 *   "options.updated_at",
 *   "options.deleted_at",
 *   "options.title",
 *   "options.product_id",
 *   "options.metadata",
 *   "options.values.id",
 *   "options.values.created_at",
 *   "options.values.updated_at",
 *   "options.values.deleted_at",
 *   "options.values.value",
 *   "options.values.option_id",
 *   "options.values.variant_id",
 *   "options.values.metadata",
 * ]
 *
 * const remoteQueryObject = remoteQueryObjectFromString({
 *   entryPoint: "product",
 *   variables: {},
 *   fields,
 * })
 *
 * console.log(remoteQueryObject)
 * // {
 * //   product: {
 * //     __args: {},
 * //     fields: [
 * //       "id",
 * //       "created_at",
 * //       "updated_at",
 * //       "deleted_at",
 * //       "url",
 * //       "metadata",
 * //     ],
 * //
 * //     tags: {
 * //       fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
 * //     },
 * //
 * //     options: {
 * //       fields: [
 * //         "id",
 * //         "created_at",
 * //         "updated_at",
 * //         "deleted_at",
 * //         "title",
 * //         "product_id",
 * //         "metadata",
 * //       ],
 * //       values: {
 * //         fields: [
 * //           "id",
 * //           "created_at",
 * //           "updated_at",
 * //           "deleted_at",
 * //           "value",
 * //           "option_id",
 * //           "variant_id",
 * //           "metadata",
 * //         ],
 * //       },
 * //     },
 * //   },
 * // }
 */
function remoteQueryObjectFromString(config) {
    var _a, e_1, _b, e_2, _c;
    var _d;
    var _e = __assign(__assign({}, config), { entryPoint: "entryPoint" in config ? config.entryPoint : undefined, service: "service" in config ? config.service : undefined }), entryPoint = _e.entryPoint, service = _e.service, variables = _e.variables, fields = _e.fields;
    var entryKey = (entryPoint !== null && entryPoint !== void 0 ? entryPoint : service);
    var remoteJoinerConfig = (_a = {},
        _a[entryKey] = {
            fields: [],
            isServiceAccess: !!service, // specifies if the entry point is a service
        },
        _a);
    var usedVariables = new Set();
    var _loop_1 = function (field) {
        if (!field.includes(".")) {
            remoteJoinerConfig[entryKey]["fields"].push(field);
            return "continue";
        }
        var fieldSegments = field.split(".");
        var fieldProperty = fieldSegments.pop();
        var combinedPath = "";
        var deepConfigRef = fieldSegments.reduce(function (acc, curr) {
            var _a, _b;
            combinedPath = combinedPath ? combinedPath + "." + curr : curr;
            if ((0, is_object_1.isObject)(variables) && combinedPath in variables) {
                (_a = acc[curr]) !== null && _a !== void 0 ? _a : (acc[curr] = {});
                acc[curr]["__args"] = variables[combinedPath];
                usedVariables.add(combinedPath);
            }
            else {
                (_b = acc[curr]) !== null && _b !== void 0 ? _b : (acc[curr] = {});
            }
            return acc[curr];
        }, remoteJoinerConfig[entryKey]);
        (_d = deepConfigRef["fields"]) !== null && _d !== void 0 ? _d : (deepConfigRef["fields"] = []);
        deepConfigRef["fields"].push(fieldProperty);
    };
    try {
        for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
            var field = fields_1_1.value;
            _loop_1(field);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var topLevelArgs = {};
    try {
        for (var _f = __values(Object.keys(variables !== null && variables !== void 0 ? variables : {})), _g = _f.next(); !_g.done; _g = _f.next()) {
            var key = _g.value;
            if (!usedVariables.has(key)) {
                topLevelArgs[key] = variables[key];
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
        }
        finally { if (e_2) throw e_2.error; }
    }
    remoteJoinerConfig[entryKey]["__args"] = topLevelArgs !== null && topLevelArgs !== void 0 ? topLevelArgs : {};
    return remoteJoinerConfig;
}
exports.remoteQueryObjectFromString = remoteQueryObjectFromString;
//# sourceMappingURL=remote-query-object-from-string.js.map