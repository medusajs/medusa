"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.getSoftDeletedCascadedEntitiesIdsMappedBy = exports.transactionWrapper = void 0;
var common_1 = require("../common");
function transactionWrapper(manager, task, _a) {
    var _b;
    var _c = _a === void 0 ? {} : _a, transaction = _c.transaction, isolationLevel = _c.isolationLevel, _d = _c.enableNestedTransactions, enableNestedTransactions = _d === void 0 ? false : _d;
    return __awaiter(this, void 0, void 0, function () {
        var options, transactionMethod;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(!enableNestedTransactions && transaction)) return [3 /*break*/, 2];
                    return [4 /*yield*/, task(transaction)];
                case 1: return [2 /*return*/, _e.sent()];
                case 2:
                    options = {};
                    if (transaction) {
                        Object.assign(options, { ctx: transaction });
                    }
                    if (isolationLevel) {
                        Object.assign(options, { isolationLevel: isolationLevel });
                    }
                    transactionMethod = (_b = manager.transaction) !== null && _b !== void 0 ? _b : manager.transactional;
                    return [4 /*yield*/, transactionMethod.bind(manager)(task, options)];
                case 3: return [2 /*return*/, _e.sent()];
            }
        });
    });
}
exports.transactionWrapper = transactionWrapper;
/**
 * Can be used to create a new Object that collect the entities
 * based on the columnLookup. This is useful when you want to soft delete entities and return
 * an object where the keys are the entities name and the values are the entities
 * that were soft deleted.
 *
 * @param entities
 * @param deletedEntitiesMap
 * @param getEntityName
 */
function getSoftDeletedCascadedEntitiesIdsMappedBy(_a) {
    var e_1, _b;
    var _c, _d;
    var entities = _a.entities, deletedEntitiesMap = _a.deletedEntitiesMap, getEntityName = _a.getEntityName, restored = _a.restored;
    deletedEntitiesMap !== null && deletedEntitiesMap !== void 0 ? deletedEntitiesMap : (deletedEntitiesMap = new Map());
    getEntityName !== null && getEntityName !== void 0 ? getEntityName : (getEntityName = function (entity) { return entity.constructor.name; });
    var _loop_1 = function (entity) {
        var entityName = getEntityName(entity);
        var shouldSkip = !!((_c = deletedEntitiesMap
            .get(entityName)) === null || _c === void 0 ? void 0 : _c.some(function (e) { return e.id === entity.id; }));
        if ((restored ? !!entity.deleted_at : !entity.deleted_at) || shouldSkip) {
            return "continue";
        }
        var values = (_d = deletedEntitiesMap.get(entityName)) !== null && _d !== void 0 ? _d : [];
        values.push(entity);
        deletedEntitiesMap.set(entityName, values);
        Object.values(entity).forEach(function (propValue) {
            if (propValue != null && (0, common_1.isObject)(propValue[0])) {
                getSoftDeletedCascadedEntitiesIdsMappedBy({
                    entities: propValue,
                    deletedEntitiesMap: deletedEntitiesMap,
                    getEntityName: getEntityName,
                });
            }
        });
    };
    try {
        for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
            var entity = entities_1_1.value;
            _loop_1(entity);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (entities_1_1 && !entities_1_1.done && (_b = entities_1.return)) _b.call(entities_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Object.fromEntries(deletedEntitiesMap);
}
exports.getSoftDeletedCascadedEntitiesIdsMappedBy = getSoftDeletedCascadedEntitiesIdsMappedBy;
//# sourceMappingURL=utils.js.map