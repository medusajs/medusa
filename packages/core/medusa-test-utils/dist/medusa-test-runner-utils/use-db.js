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
var path = require("path");
var getConfigFile = require("medusa-core-utils").getConfigFile;
var asValue = require("awilix").asValue;
var _a = require("@medusajs/utils"), isObject = _a.isObject, createMedusaContainer = _a.createMedusaContainer, MedusaV2Flag = _a.MedusaV2Flag;
var DataSource = require("typeorm").DataSource;
var ContainerRegistrationKeys = require("@medusajs/utils").ContainerRegistrationKeys;
var logger = require("@medusajs/medusa-cli/dist/reporter").logger;
module.exports = {
    initDb: function (_a) {
        var cwd = _a.cwd, 
        // use for v1 datasource only
        database_extra = _a.database_extra, env = _a.env, force_modules_migration = _a.force_modules_migration, _b = _a.dbUrl, dbUrl = _b === void 0 ? "" : _b, _c = _a.dbSchema, dbSchema = _c === void 0 ? "public" : _c;
        return __awaiter(this, void 0, void 0, function () {
            var configModuleLoader, configModule, featureFlagsLoader, featureFlagRouter, modelsLoader, entities, migrationDir, _d, getEnabledMigrations, getModuleSharedResources, _e, moduleMigrations, moduleModels, enabledMigrations, enabledEntities, dbDataSource, pgConnectionLoader, featureFlagLoader, container, featureFlagRouter_1, pgConnection, migrateMedusaApp;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (isObject(env)) {
                            Object.entries(env).forEach(function (_a) {
                                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                                return (process.env[k] = v);
                            });
                        }
                        configModuleLoader = require("@medusajs/medusa/dist/loaders/config").default;
                        configModule = configModuleLoader(cwd);
                        featureFlagsLoader = require("@medusajs/medusa/dist/loaders/feature-flags").default;
                        featureFlagRouter = featureFlagsLoader(configModule);
                        modelsLoader = require("@medusajs/medusa/dist/loaders/models").default;
                        entities = modelsLoader({}, { register: false });
                        migrationDir = path.resolve(path.join(cwd, "../../", "node_modules", "@medusajs", "medusa", "dist", "migrations", "*.js"));
                        _d = require("@medusajs/medusa/dist/commands/utils/get-migrations"), getEnabledMigrations = _d.getEnabledMigrations, getModuleSharedResources = _d.getModuleSharedResources;
                        _e = getModuleSharedResources(configModule, featureFlagRouter), moduleMigrations = _e.migrations, moduleModels = _e.models;
                        enabledMigrations = getEnabledMigrations([migrationDir], function (flag) {
                            return featureFlagRouter.isFeatureEnabled(flag);
                        });
                        enabledEntities = entities.filter(function (e) { return typeof e.isFeatureEnabled === "undefined" || e.isFeatureEnabled(); });
                        dbDataSource = new DataSource({
                            type: "postgres",
                            url: dbUrl || configModule.projectConfig.database_url,
                            entities: enabledEntities.concat(moduleModels),
                            migrations: enabledMigrations.concat(moduleMigrations),
                            extra: database_extra !== null && database_extra !== void 0 ? database_extra : {},
                            //name: "integration-tests",
                            schema: dbSchema,
                        });
                        return [4 /*yield*/, dbDataSource.initialize()];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, dbDataSource.runMigrations()];
                    case 2:
                        _g.sent();
                        if (!(force_modules_migration ||
                            featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key))) return [3 /*break*/, 6];
                        pgConnectionLoader = require("@medusajs/medusa/dist/loaders/pg-connection").default;
                        featureFlagLoader = require("@medusajs/medusa/dist/loaders/feature-flags").default;
                        container = createMedusaContainer();
                        return [4 /*yield*/, featureFlagLoader(configModule)];
                    case 3:
                        featureFlagRouter_1 = _g.sent();
                        return [4 /*yield*/, pgConnectionLoader({
                                configModule: __assign(__assign({}, configModule), { projectConfig: __assign(__assign({}, configModule.projectConfig), { database_url: dbUrl || configModule.projectConfig.database_url }) }),
                                container: container,
                            })];
                    case 4:
                        pgConnection = _g.sent();
                        container.register((_f = {},
                            _f[ContainerRegistrationKeys.CONFIG_MODULE] = asValue(configModule),
                            _f[ContainerRegistrationKeys.LOGGER] = asValue(logger),
                            _f[ContainerRegistrationKeys.MANAGER] = asValue(dbDataSource.manager),
                            _f[ContainerRegistrationKeys.PG_CONNECTION] = asValue(pgConnection),
                            _f.featureFlagRouter = asValue(featureFlagRouter_1),
                            _f));
                        migrateMedusaApp = require("@medusajs/medusa/dist/loaders/medusa-app").migrateMedusaApp;
                        return [4 /*yield*/, migrateMedusaApp({ configModule: configModule, container: container }, { registerInContainer: false })];
                    case 5:
                        _g.sent();
                        _g.label = 6;
                    case 6: return [2 /*return*/, { dbDataSource: dbDataSource, pgConnection: pgConnection }];
                }
            });
        });
    },
};
//# sourceMappingURL=use-db.js.map