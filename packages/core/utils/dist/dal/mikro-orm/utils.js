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
exports.mikroOrmUpdateDeletedAtRecursively = void 0;
var modules_sdk_1 = require("../../modules-sdk");
var core_1 = require("@mikro-orm/core");
function detectCircularDependency(manager, entityMetadata, visited, shouldStop) {
    var e_1, _a;
    if (visited === void 0) { visited = new Set(); }
    if (shouldStop === void 0) { shouldStop = false; }
    if (shouldStop) {
        return;
    }
    visited.add(entityMetadata.className);
    var relations = entityMetadata.relations;
    var relationsToCascade = relations.filter(function (relation) {
        return relation.cascade.includes("soft-remove");
    });
    try {
        for (var relationsToCascade_1 = __values(relationsToCascade), relationsToCascade_1_1 = relationsToCascade_1.next(); !relationsToCascade_1_1.done; relationsToCascade_1_1 = relationsToCascade_1.next()) {
            var relation = relationsToCascade_1_1.value;
            var branchVisited = new Set(Array.from(visited));
            var isSelfCircularDependency = entityMetadata.class === relation.entity();
            if (!isSelfCircularDependency && branchVisited.has(relation.name)) {
                var dependencies = Array.from(visited);
                dependencies.push(entityMetadata.className);
                var circularDependencyStr = dependencies.join(" -> ");
                throw new Error("Unable to soft delete the ".concat(relation.name, ". Circular dependency detected: ").concat(circularDependencyStr));
            }
            branchVisited.add(relation.name);
            var relationEntityMetadata = manager
                .getDriver()
                .getMetadata()
                .get(relation.type);
            detectCircularDependency(manager, relationEntityMetadata, branchVisited, isSelfCircularDependency);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (relationsToCascade_1_1 && !relationsToCascade_1_1.done && (_a = relationsToCascade_1.return)) _a.call(relationsToCascade_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function performCascadingSoftDeletion(manager, entity, value) {
    return __awaiter(this, void 0, void 0, function () {
        var entityName, relations, relationsToCascade, _loop_1, relationsToCascade_2, relationsToCascade_2_1, relation, e_2_1;
        var e_2, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("deleted_at" in entity))
                        return [2 /*return*/];
                    entity.deleted_at = value;
                    entityName = entity.constructor.name;
                    relations = manager.getDriver().getMetadata().get(entityName).relations;
                    relationsToCascade = relations.filter(function (relation) {
                        return relation.cascade.includes("soft-remove");
                    });
                    _loop_1 = function (relation) {
                        var entityRelation, retrieveEntity, isCollection, relationEntities, wrappedEntity, initializedEntityRelation, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    entityRelation = entity[relation.name];
                                    // Handle optional relationships
                                    if (relation.nullable && !entityRelation) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    retrieveEntity = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var query;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    query = (0, modules_sdk_1.buildQuery)({
                                                        id: entity.id,
                                                    }, {
                                                        relations: [relation.name],
                                                        withDeleted: true,
                                                    });
                                                    return [4 /*yield*/, manager.findOne(entity.constructor.name, query.where, query.options)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    }); };
                                    if (!!entityRelation) return [3 /*break*/, 2];
                                    return [4 /*yield*/, retrieveEntity()];
                                case 1:
                                    // Fixes the case of many to many through pivot table
                                    entityRelation = _d.sent();
                                    if (!entityRelation) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    _d.label = 2;
                                case 2:
                                    isCollection = "toArray" in entityRelation;
                                    relationEntities = [];
                                    if (!isCollection) return [3 /*break*/, 5];
                                    if (!!entityRelation.isInitialized()) return [3 /*break*/, 4];
                                    return [4 /*yield*/, retrieveEntity()];
                                case 3:
                                    entityRelation = _d.sent();
                                    entityRelation = entityRelation[relation.name];
                                    _d.label = 4;
                                case 4:
                                    relationEntities = entityRelation.getItems();
                                    return [3 /*break*/, 9];
                                case 5:
                                    wrappedEntity = (0, core_1.wrap)(entityRelation);
                                    if (!wrappedEntity.isInitialized()) return [3 /*break*/, 6];
                                    _c = entityRelation;
                                    return [3 /*break*/, 8];
                                case 6: return [4 /*yield*/, (0, core_1.wrap)(entityRelation).init()];
                                case 7:
                                    _c = _d.sent();
                                    _d.label = 8;
                                case 8:
                                    initializedEntityRelation = _c;
                                    relationEntities = [initializedEntityRelation];
                                    _d.label = 9;
                                case 9:
                                    if (!relationEntities.length) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, (0, exports.mikroOrmUpdateDeletedAtRecursively)(manager, relationEntities, value)];
                                case 10:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    relationsToCascade_2 = __values(relationsToCascade), relationsToCascade_2_1 = relationsToCascade_2.next();
                    _b.label = 2;
                case 2:
                    if (!!relationsToCascade_2_1.done) return [3 /*break*/, 5];
                    relation = relationsToCascade_2_1.value;
                    return [5 /*yield**/, _loop_1(relation)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    relationsToCascade_2_1 = relationsToCascade_2.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (relationsToCascade_2_1 && !relationsToCascade_2_1.done && (_a = relationsToCascade_2.return)) _a.call(relationsToCascade_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 8: return [4 /*yield*/, manager.persist(entity)];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var mikroOrmUpdateDeletedAtRecursively = function (manager, entities, value) { return __awaiter(void 0, void 0, void 0, function () {
    var entities_1, entities_1_1, entity, entityMetadata, e_3_1;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                entities_1 = __values(entities), entities_1_1 = entities_1.next();
                _b.label = 1;
            case 1:
                if (!!entities_1_1.done) return [3 /*break*/, 4];
                entity = entities_1_1.value;
                entityMetadata = manager
                    .getDriver()
                    .getMetadata()
                    .get(entity.constructor.name);
                detectCircularDependency(manager, entityMetadata);
                return [4 /*yield*/, performCascadingSoftDeletion(manager, entity, value)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                entities_1_1 = entities_1.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
                }
                finally { if (e_3) throw e_3.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.mikroOrmUpdateDeletedAtRecursively = mikroOrmUpdateDeletedAtRecursively;
//# sourceMappingURL=utils.js.map