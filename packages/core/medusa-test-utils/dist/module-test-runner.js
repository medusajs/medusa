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
exports.moduleIntegrationTestRunner = void 0;
var init_modules_1 = require("./init-modules");
var database_1 = require("./database");
var _1 = require(".");
var utils_1 = require("@medusajs/utils");
function moduleIntegrationTestRunner(_a) {
    var _b, _c;
    var _this = this;
    var moduleName = _a.moduleName, moduleModels = _a.moduleModels, _d = _a.moduleOptions, moduleOptions = _d === void 0 ? {} : _d, _e = _a.joinerConfig, joinerConfig = _e === void 0 ? [] : _e, _f = _a.schema, schema = _f === void 0 ? "public" : _f, _g = _a.debug, debug = _g === void 0 ? false : _g, testSuite = _a.testSuite, resolve = _a.resolve, _h = _a.injectedDependencies, injectedDependencies = _h === void 0 ? {} : _h;
    var moduleSdkImports = require("@medusajs/modules-sdk");
    process.env.LOG_LEVEL = "error";
    moduleModels !== null && moduleModels !== void 0 ? moduleModels : (moduleModels = Object.values(require("".concat(process.cwd(), "/src/models"))));
    // migrationPath ??= process.cwd() + "/src/migrations/!(*.d).{js,ts,cjs}"
    var tempName = parseInt(process.env.JEST_WORKER_ID || "1");
    var dbName = "medusa-".concat(moduleName.toLowerCase(), "-integration-").concat(tempName);
    var dbConfig = {
        clientUrl: (0, database_1.getDatabaseURL)(dbName),
        schema: schema,
        debug: debug,
    };
    // Use a unique connection for all the entire suite
    var connection = utils_1.ModulesSdkUtils.createPgConnection(dbConfig);
    var MikroOrmWrapper = (0, database_1.getMikroOrmWrapper)({
        mikroOrmEntities: moduleModels,
        clientUrl: dbConfig.clientUrl,
        schema: dbConfig.schema,
    });
    var modulesConfig_ = (_b = {},
        _b[moduleName] = {
            definition: moduleSdkImports.ModulesDefinition[moduleName],
            resolve: resolve,
            options: __assign({ defaultAdapterOptions: {
                    database: dbConfig,
                }, database: dbConfig }, moduleOptions),
        },
        _b);
    var moduleOptions_ = {
        injectedDependencies: __assign((_c = {}, _c[utils_1.ContainerRegistrationKeys.PG_CONNECTION] = connection, _c.eventBusService = new _1.MockEventBusService(), _c[utils_1.ContainerRegistrationKeys.LOGGER] = console, _c), injectedDependencies),
        modulesConfig: modulesConfig_,
        databaseConfig: dbConfig,
        joinerConfig: joinerConfig,
        preventConnectionDestroyWarning: true,
    };
    var shutdown;
    var moduleService;
    var medusaApp = {};
    var options = {
        MikroOrmWrapper: MikroOrmWrapper,
        medusaApp: new Proxy({}, {
            get: function (target, prop) {
                return medusaApp[prop];
            },
        }),
        service: new Proxy({}, {
            get: function (target, prop) {
                return moduleService[prop];
            },
        }),
    };
    var beforeEach_ = function () { return __awaiter(_this, void 0, void 0, function () {
        var output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MikroOrmWrapper.setupDatabase()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, init_modules_1.initModules)(moduleOptions_)];
                case 2:
                    output = _a.sent();
                    shutdown = output.shutdown;
                    medusaApp = output.medusaApp;
                    moduleService = output.medusaApp.modules[moduleName];
                    return [2 /*return*/];
            }
        });
    }); };
    var afterEach_ = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MikroOrmWrapper.clearDatabase()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, shutdown()];
                case 2:
                    _a.sent();
                    moduleService = {};
                    medusaApp = {};
                    return [2 /*return*/];
            }
        });
    }); };
    return describe("", function () {
        beforeEach(beforeEach_);
        afterEach(afterEach_);
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, ((_a = connection.context) === null || _a === void 0 ? void 0 : _a.destroy())];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, connection.destroy()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        testSuite(options);
    });
}
exports.moduleIntegrationTestRunner = moduleIntegrationTestRunner;
//# sourceMappingURL=module-test-runner.js.map