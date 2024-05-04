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
exports.stringToSelectRelationObject = void 0;
/**
 * Convert a string fields array to a specific object such as { select, relation }
 * @param fields
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
 * const remoteQueryObject = stringToSelectRelationObject(fields)
 *
 * console.log(remoteQueryObject)
 * // {
 * //   select: [
 * //     "id",
 * //     "created_at",
 * //     "updated_at",
 * //     "deleted_at",
 * //     "url",
 * //     "metadata",
 * //     "tags.id",
 * //     "tags.created_at",
 * //     "tags.updated_at",
 * //     "tags.deleted_at",
 * //     "tags.value",
 * //     "options.id",
 * //     "options.created_at",
 * //     "options.updated_at",
 * //     "options.deleted_at",
 * //     "options.title",
 * //     "options.product_id",
 * //     "options.metadata",
 * //     "options.values.id",
 * //     "options.values.created_at",
 * //     "options.values.updated_at",
 * //     "options.values.deleted_at",
 * //     "options.values.value",
 * //     "options.values.option_id",
 * //     "options.values.variant_id",
 * //     "options.values.metadata",
 * //   ],
 * //   relations: ["tags", "options", "options.values"],
 * // }
 */
function stringToSelectRelationObject(fields) {
    var e_1, _a;
    var tempResult = {
        select: new Set(),
        relations: new Set(),
    };
    try {
        for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
            var field = fields_1_1.value;
            tempResult.select.add(field);
            if (!field.includes(".")) {
                continue;
            }
            var segments = field.split(".");
            segments.pop();
            var relationPath = segments.join(".");
            tempResult.relations.add(relationPath);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return {
        select: Array.from(tempResult.select),
        relations: Array.from(tempResult.relations),
    };
}
exports.stringToSelectRelationObject = stringToSelectRelationObject;
//# sourceMappingURL=string-to-select-relation-object.js.map