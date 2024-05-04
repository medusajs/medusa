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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mikroOrmConnectionLoader = void 0;
var types_1 = require("@medusajs/types");
var awilix_1 = require("awilix");
var common_1 = require("../../common");
var dal_1 = require("../../dal");
var load_module_database_config_1 = require("../load-module-database-config");
/**
 * Load a MikroORM connection into the container
 *
 * @param moduleName
 * @param container
 * @param options
 * @param filters
 * @param moduleDeclaration
 * @param entities
 * @param pathToMigrations
 */
function mikroOrmConnectionLoader(_a) {
    var _b, _c;
    var moduleName = _a.moduleName, container = _a.container, options = _a.options, moduleDeclaration = _a.moduleDeclaration, entities = _a.entities, pathToMigrations = _a.pathToMigrations;
    return __awaiter(this, void 0, void 0, function () {
        var freeTextSearchGlobalFilter, manager, shouldSwallowError_1, dbConfig_1, dbConfig, shouldSwallowError, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    freeTextSearchGlobalFilter = (0, dal_1.mikroOrmFreeTextSearchFilterOptionsFactory)(entities);
                    manager = options === null || options === void 0 ? void 0 : options.manager;
                    // Custom manager provided
                    if (manager) {
                        container.register({
                            manager: (0, awilix_1.asValue)(manager),
                        });
                        return [2 /*return*/];
                    }
                    if (!((moduleDeclaration === null || moduleDeclaration === void 0 ? void 0 : moduleDeclaration.scope) === types_1.MODULE_SCOPE.INTERNAL &&
                        moduleDeclaration.resources === types_1.MODULE_RESOURCE_TYPE.SHARED)) return [3 /*break*/, 2];
                    shouldSwallowError_1 = true;
                    dbConfig_1 = (0, load_module_database_config_1.loadDatabaseConfig)(moduleName, (options !== null && options !== void 0 ? options : {}), shouldSwallowError_1);
                    return [4 /*yield*/, loadShared({
                            database: __assign(__assign({}, dbConfig_1), { filters: (_e = {},
                                    _e[dal_1.FreeTextSearchFilterKey] = freeTextSearchGlobalFilter,
                                    _e) }),
                            container: container,
                            entities: entities,
                            pathToMigrations: pathToMigrations,
                        })];
                case 1: return [2 /*return*/, _g.sent()];
                case 2:
                    shouldSwallowError = !!((_b = options === null || options === void 0 ? void 0 : options.database) === null || _b === void 0 ? void 0 : _b.connection);
                    dbConfig = __assign(__assign({}, (0, load_module_database_config_1.loadDatabaseConfig)(moduleName, (options !== null && options !== void 0 ? options : {}), shouldSwallowError)), { connection: (_c = options === null || options === void 0 ? void 0 : options.database) === null || _c === void 0 ? void 0 : _c.connection });
                    if (!(manager !== null && manager !== void 0)) return [3 /*break*/, 3];
                    _d = manager;
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, loadDefault({
                        database: __assign(__assign({}, dbConfig), { filters: (_f = {},
                                _f[dal_1.FreeTextSearchFilterKey] = freeTextSearchGlobalFilter,
                                _f) }),
                        entities: entities,
                        pathToMigrations: pathToMigrations,
                    })];
                case 4:
                    _d = (manager = _g.sent());
                    _g.label = 5;
                case 5:
                    _d;
                    container.register({
                        manager: (0, awilix_1.asValue)(manager),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.mikroOrmConnectionLoader = mikroOrmConnectionLoader;
function loadDefault(_a) {
    var database = _a.database, entities = _a.entities, pathToMigrations = _a.pathToMigrations;
    return __awaiter(this, void 0, void 0, function () {
        var orm;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!database) {
                        throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_ARGUMENT, "Database config is not present at module config \"options.database\"");
                    }
                    return [4 /*yield*/, (0, dal_1.mikroOrmCreateConnection)(database, entities, pathToMigrations)];
                case 1:
                    orm = _b.sent();
                    return [2 /*return*/, orm.em.fork()];
            }
        });
    });
}
function loadShared(_a) {
    var database = _a.database, container = _a.container, entities = _a.entities, pathToMigrations = _a.pathToMigrations;
    return __awaiter(this, void 0, void 0, function () {
        var sharedConnection, manager;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sharedConnection = container.resolve(common_1.ContainerRegistrationKeys.PG_CONNECTION, {
                        allowUnregistered: true,
                    });
                    if (!sharedConnection) {
                        throw new Error("The module is setup to use a shared resources but no shared connection is present.");
                    }
                    return [4 /*yield*/, loadDefault({
                            entities: entities,
                            database: __assign(__assign({}, database), { connection: sharedConnection }),
                            pathToMigrations: pathToMigrations,
                        })];
                case 1:
                    manager = _b.sent();
                    container.register({
                        manager: (0, awilix_1.asValue)(manager),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=mikro-orm-connection-loader.js.map