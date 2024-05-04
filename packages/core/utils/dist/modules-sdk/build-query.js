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
exports.buildQuery = void 0;
var common_1 = require("../common");
var dal_1 = require("../dal");
// Following convention here is fine, we can make it configurable if needed.
var DELETED_AT_FIELD_NAME = "deleted_at";
function buildQuery(filters, config) {
    var e_1, _a;
    var _b, _c, _d, _e, _f;
    if (filters === void 0) { filters = {}; }
    if (config === void 0) { config = {}; }
    var where = {};
    var filterFlags = {};
    buildWhere(filters, where, filterFlags);
    var primaryKeyFieldArray = (0, common_1.isDefined)(config.primaryKeyFields)
        ? !Array.isArray(config.primaryKeyFields)
            ? [config.primaryKeyFields]
            : config.primaryKeyFields
        : ["id"];
    var whereHasPrimaryKeyFields = primaryKeyFieldArray.some(function (pkField) { return !!where[pkField]; });
    var defaultLimit = whereHasPrimaryKeyFields ? undefined : 15;
    delete config.primaryKeyFields;
    var findOptions = {
        populate: (0, common_1.deduplicate)((_b = config.relations) !== null && _b !== void 0 ? _b : []),
        fields: config.select,
        limit: (Number.isSafeInteger(config.take) && config.take >= 0) ||
            null === config.take
            ? (_c = config.take) !== null && _c !== void 0 ? _c : undefined
            : defaultLimit,
        offset: (Number.isSafeInteger(config.skip) && config.skip >= 0) ||
            null === config.skip
            ? (_d = config.skip) !== null && _d !== void 0 ? _d : undefined
            : 0,
    };
    if (config.order) {
        findOptions.orderBy = config.order;
    }
    if (config.withDeleted || filterFlags.withDeleted) {
        (_e = findOptions.filters) !== null && _e !== void 0 ? _e : (findOptions.filters = {});
        findOptions.filters[dal_1.SoftDeletableFilterKey] = {
            withDeleted: true,
        };
    }
    if (config.filters) {
        (_f = findOptions.filters) !== null && _f !== void 0 ? _f : (findOptions.filters = {});
        try {
            for (var _g = __values(Object.entries(config.filters)), _h = _g.next(); !_h.done; _h = _g.next()) {
                var _j = __read(_h.value, 2), key = _j[0], value = _j[1];
                findOptions.filters[key] = value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return { where: where, options: findOptions };
}
exports.buildQuery = buildQuery;
function buildWhere(filters, where, flags) {
    var e_2, _a;
    if (filters === void 0) { filters = {}; }
    if (where === void 0) { where = {}; }
    if (flags === void 0) { flags = {}; }
    try {
        for (var _b = __values(Object.entries(filters)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), prop = _d[0], value = _d[1];
            if (prop === DELETED_AT_FIELD_NAME) {
                flags.withDeleted = true;
            }
            if (["$or", "$and"].includes(prop)) {
                where[prop] = value.map(function (val) {
                    var deepWhere = {};
                    buildWhere(val, deepWhere, flags);
                    return deepWhere;
                });
                continue;
            }
            if (Array.isArray(value)) {
                value = (0, common_1.deduplicate)(value);
                where[prop] = ["$in", "$nin"].includes(prop) ? value : { $in: value };
                continue;
            }
            if ((0, common_1.isObject)(value)) {
                where[prop] = {};
                buildWhere(value, where[prop], flags);
                continue;
            }
            where[prop] = value;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
//# sourceMappingURL=build-query.js.map