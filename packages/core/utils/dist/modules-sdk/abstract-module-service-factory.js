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
exports.abstractModuleServiceFactory = void 0;
var common_1 = require("../common");
var decorators_1 = require("./decorators");
var readMethods = ["retrieve", "list", "listAndCount"];
var writeMethods = [
    "delete",
    "softDelete",
    "restore",
    "create",
    "update",
];
var methods = __spreadArray(__spreadArray([], __read(readMethods), false), __read(writeMethods), false);
/**
 * Factory function for creating an abstract module service
 *
 * @example
 *
 * const otherModels = new Set([
 *   Currency,
 *   Price,
 *   PriceList,
 *   PriceListRule,
 *   PriceListRuleValue,
 *   PriceRule,
 *   PriceSetRuleType,
 *   RuleType,
 * ])
 *
 * const AbstractModuleService = ModulesSdkUtils.abstractModuleServiceFactory<
 *   InjectedDependencies,
 *   PricingTypes.PriceSetDTO,
 *   // The configuration of each entity also accept singular/plural properties, if not provided then it is using english pluralization
 *   {
 *     Currency: { dto: PricingTypes.CurrencyDTO }
 *     Price: { dto: PricingTypes.PriceDTO }
 *     PriceRule: { dto: PricingTypes.PriceRuleDTO }
 *     RuleType: { dto: PricingTypes.RuleTypeDTO }
 *     PriceList: { dto: PricingTypes.PriceListDTO }
 *     PriceListRule: { dto: PricingTypes.PriceListRuleDTO }
 *   }
 * >(PriceSet, [...otherModels], entityNameToLinkableKeysMap)
 *
 * @param mainModel
 * @param otherModels
 * @param entityNameToLinkableKeysMap
 */
function abstractModuleServiceFactory(mainModel, otherModels, entityNameToLinkableKeysMap) {
    var e_1, _a, e_2, _b;
    if (entityNameToLinkableKeysMap === void 0) { entityNameToLinkableKeysMap = {}; }
    var buildMethodNamesFromModel = function (model, suffixed) {
        if (suffixed === void 0) { suffixed = true; }
        return methods.reduce(function (acc, method) {
            var _a;
            var modelName = "";
            if (method === "retrieve") {
                modelName =
                    "singular" in model && model.singular
                        ? model.singular
                        : model.name;
            }
            else {
                modelName =
                    "plural" in model && model.plural
                        ? model.plural
                        : (0, common_1.pluralize)(model.name);
            }
            var methodName = suffixed
                ? "".concat(method).concat((0, common_1.upperCaseFirst)(modelName))
                : method;
            return __assign(__assign({}, acc), (_a = {}, _a[method] = methodName, _a));
        }, {});
    };
    var buildAndAssignMethodImpl = function (klassPrototype, method, methodName, model) {
        var serviceRegistrationName = "".concat((0, common_1.lowerCaseFirst)(model.name), "Service");
        var applyMethod = function (impl, contextIndex) {
            klassPrototype[methodName] = impl;
            var descriptorMockRef = {
                value: klassPrototype[methodName],
            };
            (0, decorators_1.MedusaContext)()(klassPrototype, methodName, contextIndex);
            var ManagerDecorator = readMethods.includes(method)
                ? decorators_1.InjectManager
                : decorators_1.InjectTransactionManager;
            ManagerDecorator("baseRepository_")(klassPrototype, methodName, descriptorMockRef);
            klassPrototype[methodName] = descriptorMockRef.value;
        };
        var methodImplementation = function () {
            void 0;
        };
        switch (method) {
            case "retrieve":
                methodImplementation = function (id, config, sharedContext) {
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var entities;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.__container__[serviceRegistrationName].retrieve(id, config, sharedContext)];
                                case 1:
                                    entities = _a.sent();
                                    return [4 /*yield*/, this.baseRepository_.serialize(entities, {
                                            populate: true,
                                        })];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 2);
                break;
            case "create":
                methodImplementation = function (data, sharedContext) {
                    if (data === void 0) { data = []; }
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var serviceData, service, entities, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    serviceData = Array.isArray(data) ? data : [data];
                                    service = this.__container__[serviceRegistrationName];
                                    return [4 /*yield*/, service.create(serviceData, sharedContext)];
                                case 1:
                                    entities = _a.sent();
                                    response = Array.isArray(data) ? entities : entities[0];
                                    return [4 /*yield*/, this.baseRepository_.serialize(response, {
                                            populate: true,
                                        })];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 1);
                break;
            case "update":
                methodImplementation = function (data, sharedContext) {
                    if (data === void 0) { data = []; }
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var serviceData, service, entities, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    serviceData = Array.isArray(data) ? data : [data];
                                    service = this.__container__[serviceRegistrationName];
                                    return [4 /*yield*/, service.update(serviceData, sharedContext)];
                                case 1:
                                    entities = _a.sent();
                                    response = Array.isArray(data) ? entities : entities[0];
                                    return [4 /*yield*/, this.baseRepository_.serialize(response, {
                                            populate: true,
                                        })];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 1);
                break;
            case "list":
                methodImplementation = function (filters, config, sharedContext) {
                    if (filters === void 0) { filters = {}; }
                    if (config === void 0) { config = {}; }
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var service, entities;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    service = this.__container__[serviceRegistrationName];
                                    return [4 /*yield*/, service.list(filters, config, sharedContext)];
                                case 1:
                                    entities = _a.sent();
                                    return [4 /*yield*/, this.baseRepository_.serialize(entities, {
                                            populate: true,
                                        })];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 2);
                break;
            case "listAndCount":
                methodImplementation = function (filters, config, sharedContext) {
                    if (filters === void 0) { filters = {}; }
                    if (config === void 0) { config = {}; }
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var _a, entities, count;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.__container__[serviceRegistrationName].listAndCount(filters, config, sharedContext)];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), entities = _a[0], count = _a[1];
                                    return [4 /*yield*/, this.baseRepository_.serialize(entities, {
                                            populate: true,
                                        })];
                                case 2: return [2 /*return*/, [
                                        _b.sent(),
                                        count
                                    ]];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 2);
                break;
            case "delete":
                methodImplementation = function (primaryKeyValues, sharedContext) {
                    var _a;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var primaryKeyValues_;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    primaryKeyValues_ = Array.isArray(primaryKeyValues)
                                        ? primaryKeyValues
                                        : [primaryKeyValues];
                                    return [4 /*yield*/, this.__container__[serviceRegistrationName].delete(primaryKeyValues_, sharedContext)];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, ((_a = this.eventBusModuleService_) === null || _a === void 0 ? void 0 : _a.emit(primaryKeyValues_.map(function (primaryKeyValue) { return ({
                                            eventName: "".concat((0, common_1.kebabCase)(model.name), ".deleted"),
                                            data: (0, common_1.isString)(primaryKeyValue)
                                                ? { id: primaryKeyValue }
                                                : primaryKeyValue,
                                        }); })))];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 1);
                break;
            case "softDelete":
                methodImplementation = function (primaryKeyValues, config, sharedContext) {
                    var _a;
                    if (config === void 0) { config = {}; }
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var primaryKeyValues_, _b, entities, cascadedEntitiesMap, softDeletedEntities, mappedCascadedEntitiesMap;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    primaryKeyValues_ = Array.isArray(primaryKeyValues)
                                        ? primaryKeyValues
                                        : [primaryKeyValues];
                                    return [4 /*yield*/, this.__container__[serviceRegistrationName].softDelete(primaryKeyValues_, sharedContext)];
                                case 1:
                                    _b = __read.apply(void 0, [_c.sent(), 2]), entities = _b[0], cascadedEntitiesMap = _b[1];
                                    return [4 /*yield*/, this.baseRepository_.serialize(entities, {
                                            populate: true,
                                        })];
                                case 2:
                                    softDeletedEntities = _c.sent();
                                    return [4 /*yield*/, ((_a = this.eventBusModuleService_) === null || _a === void 0 ? void 0 : _a.emit(softDeletedEntities.map(function (_a) {
                                            var id = _a.id;
                                            return ({
                                                eventName: "".concat((0, common_1.kebabCase)(model.name), ".deleted"),
                                                data: { id: id },
                                            });
                                        })))
                                        // Map internal table/column names to their respective external linkable keys
                                        // eg: product.id = product_id, variant.id = variant_id
                                    ];
                                case 3:
                                    _c.sent();
                                    mappedCascadedEntitiesMap = (0, common_1.mapObjectTo)(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
                                        pick: config.returnLinkableKeys,
                                    });
                                    return [2 /*return*/, mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 2);
                break;
            case "restore":
                methodImplementation = function (primaryKeyValues, config, sharedContext) {
                    if (config === void 0) { config = {}; }
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __awaiter(this, void 0, void 0, function () {
                        var primaryKeyValues_, _a, _, cascadedEntitiesMap, mappedCascadedEntitiesMap;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    primaryKeyValues_ = Array.isArray(primaryKeyValues)
                                        ? primaryKeyValues
                                        : [primaryKeyValues];
                                    return [4 /*yield*/, this.__container__[serviceRegistrationName].restore(primaryKeyValues_, sharedContext)];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), _ = _a[0], cascadedEntitiesMap = _a[1];
                                    // Map internal table/column names to their respective external linkable keys
                                    // eg: product.id = product_id, variant.id = variant_id
                                    mappedCascadedEntitiesMap = (0, common_1.mapObjectTo)(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
                                        pick: config.returnLinkableKeys,
                                    });
                                    return [2 /*return*/, mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0];
                            }
                        });
                    });
                };
                applyMethod(methodImplementation, 2);
                break;
        }
    };
    var AbstractModuleService_ = /** @class */ (function () {
        function AbstractModuleService_(container) {
            this.__container__ = container;
            this.baseRepository_ = container.baseRepository;
            var hasEventBusModuleService = Object.keys(this.__container__).find(
            // TODO: Should use ModuleRegistrationName.EVENT_BUS but it would require to move it to the utils package to prevent circular dependencies
            function (key) { return key === "eventBusModuleService"; });
            var hasEventBusService = Object.keys(this.__container__).find(function (key) { return key === "eventBusService"; });
            this.eventBusModuleService_ = hasEventBusService
                ? this.__container__.eventBusService
                : hasEventBusModuleService
                    ? this.__container__.eventBusModuleService
                    : undefined;
        }
        AbstractModuleService_.prototype.emitEvents_ = function (groupedEvents) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, _a, _b, group;
                var e_3, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!this.eventBusModuleService_ || !groupedEvents) {
                                return [2 /*return*/];
                            }
                            promises = [];
                            try {
                                for (_a = __values(Object.keys(groupedEvents)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    group = _b.value;
                                    promises.push(this.eventBusModuleService_.emit(groupedEvents[group]));
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AbstractModuleService_;
    }());
    var mainModelMethods = buildMethodNamesFromModel(mainModel, false);
    try {
        /**
         * Build the main retrieve/list/listAndCount/delete/softDelete/restore methods for the main model
         */
        for (var _c = __values(Object.entries(mainModelMethods)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), method = _e[0], methodName = _e[1];
            buildAndAssignMethodImpl(AbstractModuleService_.prototype, method, methodName, mainModel);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    /**
     * Build the retrieve/list/listAndCount/delete/softDelete/restore methods for all the other models
     */
    var otherModelsMethods = otherModels.map(function (model) { return [model, buildMethodNamesFromModel(model)]; });
    var _loop_1 = function (model, modelsMethods) {
        Object.entries(modelsMethods).forEach(function (_a) {
            var _b = __read(_a, 2), method = _b[0], methodName = _b[1];
            model = "model" in model ? model.model : model;
            buildAndAssignMethodImpl(AbstractModuleService_.prototype, method, methodName, model);
        });
    };
    try {
        for (var otherModelsMethods_1 = __values(otherModelsMethods), otherModelsMethods_1_1 = otherModelsMethods_1.next(); !otherModelsMethods_1_1.done; otherModelsMethods_1_1 = otherModelsMethods_1.next()) {
            var _f = __read(otherModelsMethods_1_1.value, 2), model = _f[0], modelsMethods = _f[1];
            _loop_1(model, modelsMethods);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (otherModelsMethods_1_1 && !otherModelsMethods_1_1.done && (_b = otherModelsMethods_1.return)) _b.call(otherModelsMethods_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return AbstractModuleService_;
}
exports.abstractModuleServiceFactory = abstractModuleServiceFactory;
//# sourceMappingURL=abstract-module-service-factory.js.map