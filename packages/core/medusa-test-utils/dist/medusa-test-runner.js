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
exports.medusaIntegrationTestRunner = void 0;
var database_1 = require("./database");
var use_db_1 = require("./medusa-test-runner-utils/use-db");
var bootstrap_app_1 = require("./medusa-test-runner-utils/bootstrap-app");
var pg_god_1 = require("pg-god");
var utils_1 = require("@medusajs/utils");
var axios = require("axios").default;
var DB_HOST = process.env.DB_HOST;
var DB_USERNAME = process.env.DB_USERNAME;
var DB_PASSWORD = process.env.DB_PASSWORD;
var pgGodCredentials = {
    user: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
};
var dbTestUtilFactory = function () { return ({
    db_: null,
    pgConnection_: null,
    clear: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this.db_) === null || _a === void 0 ? void 0 : _a.synchronize(true);
                return [2 /*return*/];
            });
        });
    },
    create: function (dbName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, pg_god_1.createDatabase)({ databaseName: dbName }, pgGodCredentials)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    teardown: function (_a) {
        var _b = _a === void 0 ? {} : _a, forceDelete = _b.forceDelete, schema = _b.schema;
        return __awaiter(this, void 0, void 0, function () {
            var manager, tableNames, tableNames_1, tableNames_1_1, table_name, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        forceDelete !== null && forceDelete !== void 0 ? forceDelete : (forceDelete = []);
                        if (!this.db_) {
                            return [2 /*return*/];
                        }
                        manager = this.db_.manager;
                        schema !== null && schema !== void 0 ? schema : (schema = "public");
                        return [4 /*yield*/, manager.query("SET session_replication_role = 'replica';")];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, manager.query("SELECT table_name\n                                            FROM information_schema.tables\n                                            WHERE table_schema = '".concat(schema, "';"))];
                    case 2:
                        tableNames = _d.sent();
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 8, 9, 10]);
                        tableNames_1 = __values(tableNames), tableNames_1_1 = tableNames_1.next();
                        _d.label = 4;
                    case 4:
                        if (!!tableNames_1_1.done) return [3 /*break*/, 7];
                        table_name = tableNames_1_1.value.table_name;
                        return [4 /*yield*/, manager.query("DELETE\n                           FROM ".concat(schema, ".\"").concat(table_name, "\";"))];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        tableNames_1_1 = tableNames_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (tableNames_1_1 && !tableNames_1_1.done && (_c = tableNames_1.return)) _c.call(tableNames_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10: return [4 /*yield*/, manager.query("SET session_replication_role = 'origin';")];
                    case 11:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    shutdown: function (dbName) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, ((_a = this.db_) === null || _a === void 0 ? void 0 : _a.destroy())];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, ((_c = (_b = this.pgConnection_) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.destroy())];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, ((_d = this.pgConnection_) === null || _d === void 0 ? void 0 : _d.destroy())];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, (0, pg_god_1.dropDatabase)({ databaseName: dbName, errorIfNonExist: false }, pgGodCredentials)];
                    case 4: return [2 /*return*/, _e.sent()];
                }
            });
        });
    },
}); };
function medusaIntegrationTestRunner(_a) {
    var _this = this;
    var moduleName = _a.moduleName, dbName = _a.dbName, _b = _a.schema, schema = _b === void 0 ? "public" : _b, _c = _a.env, env = _c === void 0 ? {} : _c, _d = _a.force_modules_migration, force_modules_migration = _d === void 0 ? false : _d, _e = _a.debug, debug = _e === void 0 ? false : _e, testSuite = _a.testSuite;
    var tempName = parseInt(process.env.JEST_WORKER_ID || "1");
    moduleName = moduleName !== null && moduleName !== void 0 ? moduleName : Math.random().toString(36).substring(7);
    dbName !== null && dbName !== void 0 ? dbName : (dbName = "medusa-".concat(moduleName.toLowerCase(), "-integration-").concat(tempName));
    var dbConfig = {
        dbName: dbName,
        clientUrl: (0, database_1.getDatabaseURL)(dbName),
        schema: schema,
        debug: debug,
    };
    var originalConfigLoader = require("@medusajs/medusa/dist/loaders/config").default;
    require("@medusajs/medusa/dist/loaders/config").default = function (rootDirectory) {
        var config = originalConfigLoader(rootDirectory);
        config.projectConfig.database_url = dbConfig.clientUrl;
        config.projectConfig.database_driver_options = dbConfig.clientUrl.includes("localhost") ? {} : {
            connection: {
                ssl: { rejectUnauthorized: false },
            },
            idle_in_transaction_session_timeout: 20000,
        };
        return config;
    };
    var cwd = process.cwd();
    var shutdown = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, void 0];
    }); }); };
    var dbUtils = dbTestUtilFactory();
    var container;
    var apiUtils;
    var options = {
        dbUtils: dbUtils,
        api: new Proxy({}, {
            get: function (target, prop) {
                return apiUtils[prop];
            },
        }),
        dbConnection: new Proxy({}, {
            get: function (target, prop) {
                return dbUtils.db_[prop];
            },
        }),
        getContainer: function () { return container; },
    };
    var isFirstTime = true;
    var beforeAll_ = function () { return __awaiter(_this, void 0, void 0, function () {
        var dataSourceRes, pgConnectionRes, _a, dbDataSource, pgConnection, error_1, containerRes, serverShutdownRes, portRes, _b, _c, shutdown_1, container_1, port, error_2, cancelTokenSource;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, dbUtils.create(dbName)];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, use_db_1.initDb)({
                            cwd: cwd,
                            env: env,
                            force_modules_migration: force_modules_migration,
                            database_extra: {},
                            dbUrl: dbConfig.clientUrl,
                            dbSchema: dbConfig.schema,
                        })];
                case 3:
                    _a = _d.sent(), dbDataSource = _a.dbDataSource, pgConnection = _a.pgConnection;
                    dataSourceRes = dbDataSource;
                    pgConnectionRes = pgConnection;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _d.sent();
                    console.error("Error initializing database", error_1 === null || error_1 === void 0 ? void 0 : error_1.message);
                    throw error_1;
                case 5:
                    dbUtils.db_ = dataSourceRes;
                    dbUtils.pgConnection_ = pgConnectionRes;
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, bootstrap_app_1.startBootstrapApp)({
                            cwd: cwd,
                            env: env,
                        })];
                case 7:
                    _b = _d.sent(), _c = _b.shutdown, shutdown_1 = _c === void 0 ? function () { return void 0; } : _c, container_1 = _b.container, port = _b.port;
                    containerRes = container_1;
                    serverShutdownRes = shutdown_1;
                    portRes = port;
                    return [3 /*break*/, 9];
                case 8:
                    error_2 = _d.sent();
                    console.error("Error starting the app", error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                    throw error_2;
                case 9:
                    cancelTokenSource = axios.CancelToken.source();
                    container = containerRes;
                    shutdown = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, serverShutdownRes()];
                                case 1:
                                    _a.sent();
                                    cancelTokenSource.cancel("Request canceled by shutdown");
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    apiUtils = axios.create({
                        baseURL: "http://localhost:".concat(portRes),
                        cancelToken: cancelTokenSource.token,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var beforeEach_ = function () { return __awaiter(_this, void 0, void 0, function () {
        var container, copiedContainer, defaultLoader, error_3, medusaAppLoaderRunner, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // The beforeAll already run everything, so lets not re run the loaders for the first iteration
                    if (isFirstTime) {
                        isFirstTime = false;
                        return [2 /*return*/];
                    }
                    container = options.getContainer();
                    copiedContainer = (0, utils_1.createMedusaContainer)({}, container);
                    if (!(process.env.MEDUSA_FF_MEDUSA_V2 != "true")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    defaultLoader = require("@medusajs/medusa/dist/loaders/defaults").default;
                    return [4 /*yield*/, defaultLoader({
                            container: copiedContainer,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error runner medusa loaders", error_3 === null || error_3 === void 0 ? void 0 : error_3.message);
                    throw error_3;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    medusaAppLoaderRunner = require("@medusajs/medusa/dist/loaders/medusa-app").runModulesLoader;
                    return [4 /*yield*/, medusaAppLoaderRunner({
                            container: copiedContainer,
                            configModule: container.resolve("configModule"),
                        })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Error runner modules loaders", error_4 === null || error_4 === void 0 ? void 0 : error_4.message);
                    throw error_4;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var afterEach_ = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dbUtils.teardown({ schema: schema })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error tearing down database:", error_5 === null || error_5 === void 0 ? void 0 : error_5.message);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return describe("", function () {
        beforeAll(beforeAll_);
        beforeEach(beforeEach_);
        afterEach(afterEach_);
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbUtils.shutdown(dbName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, shutdown()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        testSuite(options);
    });
}
exports.medusaIntegrationTestRunner = medusaIntegrationTestRunner;
//# sourceMappingURL=medusa-test-runner.js.map