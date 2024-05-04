"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.internalModuleServiceFactory = void 0;
var common_1 = require("../common");
var dal_1 = require("../dal");
var build_query_1 = require("./build-query");
var decorators_1 = require("./decorators");
function internalModuleServiceFactory(model) {
    var injectedRepositoryName = "".concat((0, common_1.lowerCaseFirst)(model.name), "Repository");
    var propertyRepositoryName = "__".concat(injectedRepositoryName, "__");
    var AbstractService_ = /** @class */ (function () {
        function AbstractService_(container) {
            this.__container__ = container;
            this[propertyRepositoryName] = container[injectedRepositoryName];
        }
        AbstractService_.applyFreeTextSearchFilter = function (filters, config) {
            var _a;
            if ((0, common_1.isDefined)(filters === null || filters === void 0 ? void 0 : filters.q)) {
                (_a = config.filters) !== null && _a !== void 0 ? _a : (config.filters = {});
                config.filters[dal_1.FreeTextSearchFilterKey] = {
                    value: filters.q,
                    fromEntity: model.name,
                };
                delete filters.q;
            }
        };
        AbstractService_.retrievePrimaryKeys = function (entity) {
            var _a, _b, _c, _d;
            return ((_d = (_b = (_a = entity.meta) === null || _a === void 0 ? void 0 : _a.primaryKeys) !== null && _b !== void 0 ? _b : (_c = entity.prototype.__meta) === null || _c === void 0 ? void 0 : _c.primaryKeys) !== null && _d !== void 0 ? _d : ["id"]);
        };
        AbstractService_.buildUniqueCompositeKeyValue = function (keys, data) {
            return keys.map(function (k) { return data[k]; }).join(":");
        };
        /**
         * Only apply top level default ordering as the relation
         * default ordering is already applied through the foreign key
         * @param config
         */
        AbstractService_.applyDefaultOrdering = function (config) {
            if ((0, common_1.isPresent)(config.order)) {
                return;
            }
            config.order = {};
            var primaryKeys = AbstractService_.retrievePrimaryKeys(model);
            primaryKeys.forEach(function (primaryKey) {
                config.order[primaryKey] = "ASC";
            });
        };
        AbstractService_.prototype.retrieve = function (idOrObject, config, sharedContext) {
            if (config === void 0) { config = {}; }
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var primaryKeys, primaryKeysCriteria, idOrObject_, queryOptions, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            primaryKeys = AbstractService_.retrievePrimaryKeys(model);
                            if (!(0, common_1.isDefined)(idOrObject) ||
                                ((0, common_1.isString)(idOrObject) && primaryKeys.length > 1) ||
                                ((!(0, common_1.isString)(idOrObject) ||
                                    ((0, common_1.isObject)(idOrObject) && !idOrObject[primaryKeys[0]])) &&
                                    primaryKeys.length === 1)) {
                                throw new common_1.MedusaError(common_1.MedusaError.Types.NOT_FOUND, "".concat(primaryKeys.length === 1
                                    ? "".concat((0, common_1.lowerCaseFirst)(model.name) + " - " + primaryKeys[0])
                                    : "".concat((0, common_1.lowerCaseFirst)(model.name), " - ").concat(primaryKeys.join(", ")), " must be defined"));
                            }
                            primaryKeysCriteria = {};
                            if (primaryKeys.length === 1) {
                                primaryKeysCriteria[primaryKeys[0]] = idOrObject;
                            }
                            else {
                                idOrObject_ = Array.isArray(idOrObject)
                                    ? idOrObject
                                    : [idOrObject];
                                primaryKeysCriteria = idOrObject_.map(function (primaryKeyValue) { return ({
                                    $and: primaryKeys.map(function (key) {
                                        var _a;
                                        return (_a = {}, _a[key] = primaryKeyValue[key], _a);
                                    }),
                                }); });
                            }
                            queryOptions = (0, build_query_1.buildQuery)(primaryKeysCriteria, config);
                            return [4 /*yield*/, this[propertyRepositoryName].find(queryOptions, sharedContext)];
                        case 1:
                            entities = _a.sent();
                            if (!(entities === null || entities === void 0 ? void 0 : entities.length)) {
                                throw new common_1.MedusaError(common_1.MedusaError.Types.NOT_FOUND, "".concat(model.name, " with ").concat(primaryKeys.join(", "), ": ").concat(Array.isArray(idOrObject)
                                    ? idOrObject.map(function (v) {
                                        return [(0, common_1.isString)(v) ? v : Object.values(v)].join(", ");
                                    })
                                    : idOrObject, " was not found"));
                            }
                            return [2 /*return*/, entities[0]];
                    }
                });
            });
        };
        AbstractService_.prototype.list = function (filters, config, sharedContext) {
            if (filters === void 0) { filters = {}; }
            if (config === void 0) { config = {}; }
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var queryOptions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            AbstractService_.applyDefaultOrdering(config);
                            AbstractService_.applyFreeTextSearchFilter(filters, config);
                            queryOptions = (0, build_query_1.buildQuery)(filters, config);
                            return [4 /*yield*/, this[propertyRepositoryName].find(queryOptions, sharedContext)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AbstractService_.prototype.listAndCount = function (filters, config, sharedContext) {
            if (filters === void 0) { filters = {}; }
            if (config === void 0) { config = {}; }
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var queryOptions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            AbstractService_.applyDefaultOrdering(config);
                            AbstractService_.applyFreeTextSearchFilter(filters, config);
                            queryOptions = (0, build_query_1.buildQuery)(filters, config);
                            return [4 /*yield*/, this[propertyRepositoryName].findAndCount(queryOptions, sharedContext)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AbstractService_.prototype.create = function (data, sharedContext) {
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var data_, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(0, common_1.isDefined)(data) || (Array.isArray(data) && data.length === 0)) {
                                return [2 /*return*/, (Array.isArray(data) ? [] : void 0)];
                            }
                            data_ = Array.isArray(data) ? data : [data];
                            return [4 /*yield*/, this[propertyRepositoryName].create(data_, sharedContext)];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, Array.isArray(data) ? entities : entities[0]];
                    }
                });
            });
        };
        AbstractService_.prototype.update = function (input, sharedContext) {
            var _a;
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var primaryKeys, inputArray, toUpdateData, keySelectorForDataOnly, keySelectorDataMap, _loop_1, this_1, inputArray_1, inputArray_1_1, input_, e_1_1, entitiesToUpdate, entityName, compositeKeysValuesForFoundEntities_1, missingEntityValues_1;
                var e_1, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(0, common_1.isDefined)(input) || (Array.isArray(input) && input.length === 0)) {
                                return [2 /*return*/, (Array.isArray(input) ? [] : void 0)];
                            }
                            primaryKeys = AbstractService_.retrievePrimaryKeys(model);
                            inputArray = Array.isArray(input) ? input : [input];
                            toUpdateData = [];
                            keySelectorForDataOnly = {
                                $or: [],
                            };
                            keySelectorDataMap = new Map();
                            _loop_1 = function (input_) {
                                var entitiesToUpdate, selector_1, uniqueCompositeKey;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            if (!input_.selector) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this_1.list(input_.selector, {}, sharedContext)
                                                // Create a pair of entity and data to update
                                            ];
                                        case 1:
                                            entitiesToUpdate = _d.sent();
                                            // Create a pair of entity and data to update
                                            entitiesToUpdate.forEach(function (entity) {
                                                toUpdateData.push({
                                                    entity: entity,
                                                    update: input_.data,
                                                });
                                            });
                                            return [3 /*break*/, 3];
                                        case 2:
                                            selector_1 = {};
                                            primaryKeys.forEach(function (key) {
                                                selector_1[key] = input_[key];
                                            });
                                            uniqueCompositeKey = AbstractService_.buildUniqueCompositeKeyValue(primaryKeys, input_);
                                            keySelectorDataMap.set(uniqueCompositeKey, input_);
                                            keySelectorForDataOnly.$or.push(selector_1);
                                            _d.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 6, 7, 8]);
                            inputArray_1 = __values(inputArray), inputArray_1_1 = inputArray_1.next();
                            _c.label = 2;
                        case 2:
                            if (!!inputArray_1_1.done) return [3 /*break*/, 5];
                            input_ = inputArray_1_1.value;
                            return [5 /*yield**/, _loop_1(input_)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            inputArray_1_1 = inputArray_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _c.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (inputArray_1_1 && !inputArray_1_1.done && (_b = inputArray_1.return)) _b.call(inputArray_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8:
                            if (!keySelectorForDataOnly.$or.length) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.list(keySelectorForDataOnly, {}, sharedContext)
                                // Create a pair of entity and data to update
                            ];
                        case 9:
                            entitiesToUpdate = _c.sent();
                            // Create a pair of entity and data to update
                            entitiesToUpdate.forEach(function (entity) {
                                var uniqueCompositeKey = AbstractService_.buildUniqueCompositeKeyValue(primaryKeys, entity);
                                toUpdateData.push({
                                    entity: entity,
                                    update: keySelectorDataMap.get(uniqueCompositeKey),
                                });
                            });
                            // Only throw for missing entities when we dont have selectors involved as selector by design can return 0 entities
                            if (entitiesToUpdate.length !== keySelectorDataMap.size) {
                                entityName = (_a = model.name) !== null && _a !== void 0 ? _a : model;
                                compositeKeysValuesForFoundEntities_1 = new Set(entitiesToUpdate.map(function (entity) {
                                    return AbstractService_.buildUniqueCompositeKeyValue(primaryKeys, entity);
                                }));
                                missingEntityValues_1 = [];
                                __spreadArray([], __read(keySelectorDataMap.keys()), false).filter(function (key) {
                                    if (!compositeKeysValuesForFoundEntities_1.has(key)) {
                                        var value = key.replace(/:/gi, " - ");
                                        missingEntityValues_1.push(value);
                                    }
                                });
                                throw new common_1.MedusaError(common_1.MedusaError.Types.NOT_FOUND, "".concat(entityName, " with ").concat(primaryKeys.join(", "), " \"").concat(missingEntityValues_1.join(", "), "\" not found"));
                            }
                            _c.label = 10;
                        case 10: return [4 /*yield*/, this[propertyRepositoryName].update(toUpdateData, sharedContext)];
                        case 11: return [2 /*return*/, _c.sent()];
                    }
                });
            });
        };
        AbstractService_.prototype.delete = function (idOrSelector, sharedContext) {
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var primaryKeys, deleteCriteria, entitiesToDelete, _loop_2, entitiesToDelete_1, entitiesToDelete_1_1, entity, primaryKeysValues;
                var e_2, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(0, common_1.isDefined)(idOrSelector) ||
                                (Array.isArray(idOrSelector) && !idOrSelector.length)) {
                                return [2 /*return*/];
                            }
                            primaryKeys = AbstractService_.retrievePrimaryKeys(model);
                            if ((Array.isArray(idOrSelector) && idOrSelector.length === 0) ||
                                (((0, common_1.isString)(idOrSelector) ||
                                    (Array.isArray(idOrSelector) && (0, common_1.isString)(idOrSelector[0]))) &&
                                    primaryKeys.length > 1)) {
                                throw new common_1.MedusaError(common_1.MedusaError.Types.NOT_FOUND, "".concat(primaryKeys.length === 1
                                    ? "\"".concat((0, common_1.lowerCaseFirst)(model.name) + " - " + primaryKeys[0], "\"")
                                    : "".concat((0, common_1.lowerCaseFirst)(model.name), " - ").concat(primaryKeys.join(", ")), " must be defined"));
                            }
                            deleteCriteria = {
                                $or: [],
                            };
                            if (!((0, common_1.isObject)(idOrSelector) && "selector" in idOrSelector)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.list(idOrSelector.selector, {
                                    select: primaryKeys,
                                }, sharedContext)];
                        case 1:
                            entitiesToDelete = _b.sent();
                            _loop_2 = function (entity) {
                                var criteria = {};
                                primaryKeys.forEach(function (key) {
                                    criteria[key] = entity[key];
                                });
                                deleteCriteria.$or.push(criteria);
                            };
                            try {
                                for (entitiesToDelete_1 = __values(entitiesToDelete), entitiesToDelete_1_1 = entitiesToDelete_1.next(); !entitiesToDelete_1_1.done; entitiesToDelete_1_1 = entitiesToDelete_1.next()) {
                                    entity = entitiesToDelete_1_1.value;
                                    _loop_2(entity);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (entitiesToDelete_1_1 && !entitiesToDelete_1_1.done && (_a = entitiesToDelete_1.return)) _a.call(entitiesToDelete_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            primaryKeysValues = Array.isArray(idOrSelector)
                                ? idOrSelector
                                : [idOrSelector];
                            deleteCriteria.$or = primaryKeysValues.map(function (primaryKeyValue) {
                                var criteria = {};
                                if ((0, common_1.isObject)(primaryKeyValue)) {
                                    Object.entries(primaryKeyValue).forEach(function (_a) {
                                        var _b = __read(_a, 2), key = _b[0], value = _b[1];
                                        criteria[key] = value;
                                    });
                                }
                                else {
                                    criteria[primaryKeys[0]] = primaryKeyValue;
                                }
                                // TODO: Revisit
                                /*primaryKeys.forEach((key) => {
                                  /!*if (
                                    isObject(primaryKeyValue) &&
                                    !isDefined(primaryKeyValue[key]) &&
                                    // primaryKeys.length > 1
                                  ) {
                                    throw new MedusaError(
                                      MedusaError.Types.INVALID_DATA,
                                      `Composite key must contain all primary key fields: ${primaryKeys.join(
                                        ", "
                                      )}. Found: ${Object.keys(primaryKeyValue)}`
                                    )
                                  }*!/
                      
                                  criteria[key] = isObject(primaryKeyValue)
                                    ? primaryKeyValue[key]
                                    : primaryKeyValue
                                })*/
                                return criteria;
                            });
                            _b.label = 3;
                        case 3: return [4 /*yield*/, this[propertyRepositoryName].delete(deleteCriteria, sharedContext)];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AbstractService_.prototype.softDelete = function (idsOrFilter, sharedContext) {
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if ((Array.isArray(idsOrFilter) && !idsOrFilter.length) ||
                                (!Array.isArray(idsOrFilter) && !idsOrFilter)) {
                                return [2 /*return*/, [[], {}]];
                            }
                            return [4 /*yield*/, this[propertyRepositoryName].softDelete(idsOrFilter, sharedContext)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AbstractService_.prototype.restore = function (idsOrFilter, sharedContext) {
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this[propertyRepositoryName].restore(idsOrFilter, sharedContext)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AbstractService_.prototype.upsert = function (data, sharedContext) {
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var data_, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data_ = Array.isArray(data) ? data : [data];
                            return [4 /*yield*/, this[propertyRepositoryName].upsert(data_, sharedContext)];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, Array.isArray(data) ? entities : entities[0]];
                    }
                });
            });
        };
        AbstractService_.prototype.upsertWithReplace = function (data, config, sharedContext) {
            if (config === void 0) { config = {
                relations: [],
            }; }
            if (sharedContext === void 0) { sharedContext = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var data_, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data_ = Array.isArray(data) ? data : [data];
                            return [4 /*yield*/, this[propertyRepositoryName].upsertWithReplace(data_, config, sharedContext)];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, Array.isArray(data) ? entities : entities[0]];
                    }
                });
            });
        };
        __decorate([
            (0, decorators_1.InjectManager)(propertyRepositoryName),
            __param(2, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "retrieve", null);
        __decorate([
            (0, decorators_1.InjectManager)(propertyRepositoryName),
            __param(2, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "list", null);
        __decorate([
            (0, decorators_1.InjectManager)(propertyRepositoryName),
            __param(2, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "listAndCount", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(common_1.shouldForceTransaction, propertyRepositoryName),
            __param(1, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "create", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(common_1.shouldForceTransaction, propertyRepositoryName),
            __param(1, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "update", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(common_1.doNotForceTransaction, propertyRepositoryName),
            __param(1, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "delete", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(propertyRepositoryName),
            __param(1, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "softDelete", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(propertyRepositoryName),
            __param(1, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "restore", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(propertyRepositoryName),
            __param(1, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "upsert", null);
        __decorate([
            (0, decorators_1.InjectTransactionManager)(propertyRepositoryName),
            __param(2, (0, decorators_1.MedusaContext)()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object, Object]),
            __metadata("design:returntype", Promise)
        ], AbstractService_.prototype, "upsertWithReplace", null);
        return AbstractService_;
    }());
    return AbstractService_;
}
exports.internalModuleServiceFactory = internalModuleServiceFactory;
//# sourceMappingURL=internal-module-service-factory.js.map