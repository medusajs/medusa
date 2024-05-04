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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertItemResponseToUpdateRequest = void 0;
var is_object_1 = require("../common/is-object");
function convertItemResponseToUpdateRequest(item, selects, relations, fromManyRelationships) {
    var e_1, _a;
    if (fromManyRelationships === void 0) { fromManyRelationships = false; }
    var newItem = {
        id: item.id,
    };
    // If item is a child of a many relationship, we just need to pass in the id of the item
    if (fromManyRelationships) {
        return newItem;
    }
    var _loop_1 = function (key, value) {
        var e_2, _e, e_3, _f;
        if (relations.includes(key)) {
            var relation = item[key];
            // If the relationship is an object, its either a one to one or many to one relationship
            // We typically don't update the parent from the child relationship, we can skip this for now.
            // This can be focused on solely for one to one relationships
            if ((0, is_object_1.isObject)(relation)) {
                // If "id" is the only one in the object, underscorize the relation. This is assuming that
                // the relationship itself was changed to another item and now we need to revert it to the old item.
                if (Object.keys(relation).length === 1 && "id" in relation) {
                    newItem["".concat(key, "_id")] = relation.id;
                }
                // If attributes of the relation have been updated, we can assume that this
                // was an update operation on the relation. We revert what was updated.
                if (Object.keys(relation).length > 1) {
                    // The ID can be figured out from the relationship, we can delete the ID here
                    if ("id" in relation) {
                        delete relation.id;
                    }
                    // we just need the selects for the relation, filter it out and remove the parent scope
                    var filteredSelects = selects
                        .filter(function (s) { return s.startsWith(key) && !s.includes("id"); })
                        .map(shiftFirstPath);
                    try {
                        // Add the filtered selects to the sanitized object
                        for (var filteredSelects_1 = (e_2 = void 0, __values(filteredSelects)), filteredSelects_1_1 = filteredSelects_1.next(); !filteredSelects_1_1.done; filteredSelects_1_1 = filteredSelects_1.next()) {
                            var filteredSelect = filteredSelects_1_1.value;
                            newItem[key] = newItem[key] || {};
                            newItem[key][filteredSelect] = relation[filteredSelect];
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (filteredSelects_1_1 && !filteredSelects_1_1.done && (_e = filteredSelects_1.return)) _e.call(filteredSelects_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                return "continue";
            }
            // If the relation is an array, we can expect this to be a one to many or many to many
            // relationships. Recursively call the function until all relations are converted
            if (Array.isArray(relation)) {
                var newRelationsArray = [];
                try {
                    for (var relation_1 = (e_3 = void 0, __values(relation)), relation_1_1 = relation_1.next(); !relation_1_1.done; relation_1_1 = relation_1.next()) {
                        var rel = relation_1_1.value;
                        // Scope selects and relations to ones that are relevant to the current relation
                        var filteredRelations = relations
                            .filter(function (r) { return r.startsWith(key); })
                            .map(shiftFirstPath);
                        var filteredSelects = selects
                            .filter(function (s) { return s.startsWith(key); })
                            .map(shiftFirstPath);
                        newRelationsArray.push(convertItemResponseToUpdateRequest(rel, filteredSelects, filteredRelations, true));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (relation_1_1 && !relation_1_1.done && (_f = relation_1.return)) _f.call(relation_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                newItem[key] = newRelationsArray;
            }
        }
        // if the key exists in the selects, we add them to the new sanitized array.
        // sanitisation is done because MikroORM adds relationship attributes and other default attributes
        // which we do not want to add to the update request
        if (selects.includes(key) && !fromManyRelationships) {
            newItem[key] = value;
        }
    };
    try {
        for (var _b = __values(Object.entries(item)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
            _loop_1(key, value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return newItem;
}
exports.convertItemResponseToUpdateRequest = convertItemResponseToUpdateRequest;
function shiftFirstPath(select) {
    var selectArray = select.split(".");
    selectArray.shift();
    return selectArray.join(".");
}
//# sourceMappingURL=convert-item-response-to-update-request.js.map