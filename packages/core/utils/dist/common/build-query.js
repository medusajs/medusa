"use strict";
// Those utils are used in a typeorm context and we can't be sure that they can be used elsewhere
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
exports.buildOrder = exports.buildRelations = exports.buildSelects = void 0;
var object_from_string_path_1 = require("./object-from-string-path");
function buildSelects(selectCollection) {
    return buildRelationsOrSelect(selectCollection);
}
exports.buildSelects = buildSelects;
function buildRelations(relationCollection) {
    return buildRelationsOrSelect(relationCollection);
}
exports.buildRelations = buildRelations;
function buildRelationsOrSelect(collection) {
    return (0, object_from_string_path_1.objectFromStringPath)(collection);
}
/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
function buildOrder(orderBy) {
    var e_1, _a;
    var _b;
    var output = {};
    var orderKeys = Object.keys(orderBy);
    try {
        for (var orderKeys_1 = __values(orderKeys), orderKeys_1_1 = orderKeys_1.next(); !orderKeys_1_1.done; orderKeys_1_1 = orderKeys_1.next()) {
            var order = orderKeys_1_1.value;
            if (order.indexOf(".") > -1) {
                var nestedOrder = order.split(".");
                var parent_1 = output;
                while (nestedOrder.length > 1) {
                    var nestedRelation = nestedOrder.shift();
                    parent_1 = (_b = parent_1[nestedRelation]) !== null && _b !== void 0 ? _b : (parent_1[nestedRelation] = {});
                }
                parent_1[nestedOrder[0]] = orderBy[order];
                continue;
            }
            output[order] = orderBy[order];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (orderKeys_1_1 && !orderKeys_1_1.done && (_a = orderKeys_1.return)) _a.call(orderKeys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output;
}
exports.buildOrder = buildOrder;
//# sourceMappingURL=build-query.js.map