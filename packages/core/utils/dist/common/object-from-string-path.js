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
exports.objectFromStringPath = void 0;
/**
 * Convert a collection of dot string into a nested object
 * @example
 * input: [
 *    order,
 *    order.items,
 *    order.swaps,
 *    order.swaps.additional_items,
 *    order.discounts,
 *    order.discounts.rule,
 *    order.claims,
 *    order.claims.additional_items,
 *    additional_items,
 *    additional_items.variant,
 *    return_order,
 *    return_order.items,
 *    return_order.shipping_method,
 *    return_order.shipping_method.tax_lines
 * ]
 * output: {
 *   "order": {
 *     "items": true,
 *     "swaps": {
 *       "additional_items": true
 *     },
 *     "discounts": {
 *       "rule": true
 *     },
 *     "claims": {
 *       "additional_items": true
 *     }
 *   },
 *   "additional_items": {
 *     "variant": true
 *   },
 *   "return_order": {
 *     "items": true,
 *     "shipping_method": {
 *       "tax_lines": true
 *     }
 *   }
 * }
 * @param collection
 */
function objectFromStringPath(collection) {
    var e_1, _a;
    var _b;
    collection = collection.sort();
    var output = {};
    try {
        for (var collection_1 = __values(collection), collection_1_1 = collection_1.next(); !collection_1_1.done; collection_1_1 = collection_1.next()) {
            var relation = collection_1_1.value;
            if (!relation) {
                continue;
            }
            if (relation.indexOf(".") > -1) {
                var nestedRelations = relation.split(".");
                var parent_1 = output;
                while (nestedRelations.length > 1) {
                    var nestedRelation = nestedRelations.shift();
                    parent_1 = parent_1[nestedRelation] =
                        parent_1[nestedRelation] !== true &&
                            typeof parent_1[nestedRelation] === "object"
                            ? parent_1[nestedRelation]
                            : {};
                }
                parent_1[nestedRelations[0]] = true;
                continue;
            }
            output[relation] = (_b = output[relation]) !== null && _b !== void 0 ? _b : true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (collection_1_1 && !collection_1_1.done && (_a = collection_1.return)) _a.call(collection_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output;
}
exports.objectFromStringPath = objectFromStringPath;
//# sourceMappingURL=object-from-string-path.js.map