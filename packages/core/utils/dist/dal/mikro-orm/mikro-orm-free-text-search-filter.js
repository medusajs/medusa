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
exports.mikroOrmFreeTextSearchFilterOptionsFactory = exports.FreeTextSearchFilterKey = void 0;
var core_1 = require("@mikro-orm/core");
exports.FreeTextSearchFilterKey = "freeTextSearch";
function getEntityProperties(entity) {
    var _a, _b, _c;
    return ((_b = (_a = entity === null || entity === void 0 ? void 0 : entity.prototype.__meta) === null || _a === void 0 ? void 0 : _a.properties) !== null && _b !== void 0 ? _b : (_c = entity.meta) === null || _c === void 0 ? void 0 : _c.properties);
}
function retrieveRelationsConstraints(relation, models, searchValue, visited, shouldStop) {
    var e_1, _a, _b, e_2, _c;
    var _d, _e, _f, _g;
    if (visited === void 0) { visited = new Set(); }
    if (shouldStop === void 0) { shouldStop = false; }
    if (shouldStop || !relation.searchable) {
        return;
    }
    var relationClassName = relation.targetMeta.className;
    visited.add(relationClassName);
    var relationFreeTextSearchWhere = [];
    var relationClass = models.find(function (m) { return m.name === relation.type; });
    var relationProperties = getEntityProperties(relationClass);
    try {
        for (var _h = __values(Object.values(relationProperties)), _j = _h.next(); !_j.done; _j = _h.next()) {
            var propertyConfiguration = _j.value;
            if (!propertyConfiguration.searchable ||
                propertyConfiguration.reference !== core_1.ReferenceType.SCALAR) {
                continue;
            }
            relationFreeTextSearchWhere.push((_b = {},
                _b[propertyConfiguration.name] = {
                    $ilike: "%".concat(searchValue, "%"),
                },
                _b));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var innerRelations = (_e = (_d = relationClass === null || relationClass === void 0 ? void 0 : relationClass.prototype.__meta) === null || _d === void 0 ? void 0 : _d.relations) !== null && _e !== void 0 ? _e : (_f = relationClass.meta) === null || _f === void 0 ? void 0 : _f.relations;
    var _loop_1 = function (innerRelation) {
        var _k;
        var branchVisited = new Set(Array.from(visited));
        var innerRelationClassName = innerRelation.targetMeta.className;
        var isSelfCircularDependency = innerRelationClassName === relationClassName;
        if (!isSelfCircularDependency &&
            branchVisited.has(innerRelationClassName)) {
            return "continue";
        }
        branchVisited.add(innerRelationClassName);
        var innerRelationName = !innerRelation.mapToPk
            ? innerRelation.name
            : (_g = relation.targetMeta.relations.find(function (r) { return r.type === innerRelation.type && !r.mapToPk; })) === null || _g === void 0 ? void 0 : _g.name;
        if (!innerRelationName) {
            throw new Error("Unable to retrieve the counter part relation definition for the mapToPk relation ".concat(innerRelation.name, " on entity ").concat(relation.name));
        }
        var relationConstraints = retrieveRelationsConstraints({
            name: innerRelationName,
            targetMeta: innerRelation.targetMeta,
            searchable: innerRelation.searchable,
            mapToPk: innerRelation.mapToPk,
            type: innerRelation.type,
        }, models, searchValue, branchVisited, isSelfCircularDependency);
        if (!(relationConstraints === null || relationConstraints === void 0 ? void 0 : relationConstraints.length)) {
            return "continue";
        }
        relationFreeTextSearchWhere.push((_k = {},
            _k[innerRelationName] = {
                $or: relationConstraints,
            },
            _k));
    };
    try {
        for (var innerRelations_1 = __values(innerRelations), innerRelations_1_1 = innerRelations_1.next(); !innerRelations_1_1.done; innerRelations_1_1 = innerRelations_1.next()) {
            var innerRelation = innerRelations_1_1.value;
            _loop_1(innerRelation);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (innerRelations_1_1 && !innerRelations_1_1.done && (_c = innerRelations_1.return)) _c.call(innerRelations_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return relationFreeTextSearchWhere;
}
var mikroOrmFreeTextSearchFilterOptionsFactory = function (models) {
    return {
        cond: function (freeTextSearchArgs, operation, manager, options) {
            var _a;
            if (!freeTextSearchArgs || !freeTextSearchArgs.value) {
                return {};
            }
            var value = freeTextSearchArgs.value, fromEntity = freeTextSearchArgs.fromEntity;
            if ((_a = options === null || options === void 0 ? void 0 : options.visited) === null || _a === void 0 ? void 0 : _a.size) {
                /**
                 * When being in select in strategy, the filter gets applied to all queries even the ones that are not related to the entity
                 */
                var hasFilterAlreadyBeenAppliedForEntity = __spreadArray([], __read(options.visited.values()), false).some(function (v) { return v.constructor.name === freeTextSearchArgs.fromEntity; });
                if (hasFilterAlreadyBeenAppliedForEntity) {
                    return {};
                }
            }
            var entityMetadata = manager.getDriver().getMetadata().get(fromEntity);
            var freeTextSearchWhere = retrieveRelationsConstraints({
                targetMeta: entityMetadata,
                mapToPk: false,
                searchable: true,
                type: fromEntity,
                name: entityMetadata.name,
            }, models, value);
            if (!freeTextSearchWhere.length) {
                return {};
            }
            return {
                $or: freeTextSearchWhere,
            };
        },
        default: true,
        args: false,
        entity: models.map(function (m) { return m.name; }),
    };
};
exports.mikroOrmFreeTextSearchFilterOptionsFactory = mikroOrmFreeTextSearchFilterOptionsFactory;
//# sourceMappingURL=mikro-orm-free-text-search-filter.js.map