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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMikroOrmWrapper = exports.getMikroOrmConfig = exports.getDatabaseURL = void 0;
var postgresql_1 = require("@mikro-orm/postgresql");
function getDatabaseURL(dbName) {
    var _a, _b;
    var DB_HOST = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : "localhost";
    var DB_USERNAME = (_b = process.env.DB_USERNAME) !== null && _b !== void 0 ? _b : "";
    var DB_PASSWORD = process.env.DB_PASSWORD;
    var DB_NAME = dbName !== null && dbName !== void 0 ? dbName : process.env.DB_TEMP_NAME;
    return "postgres://".concat(DB_USERNAME).concat(DB_PASSWORD ? ":".concat(DB_PASSWORD) : "", "@").concat(DB_HOST, "/").concat(DB_NAME);
}
exports.getDatabaseURL = getDatabaseURL;
function getMikroOrmConfig(_a) {
    var mikroOrmEntities = _a.mikroOrmEntities, pathToMigrations = _a.pathToMigrations, clientUrl = _a.clientUrl, schema = _a.schema;
    var DB_URL = clientUrl !== null && clientUrl !== void 0 ? clientUrl : getDatabaseURL();
    return {
        type: "postgresql",
        clientUrl: DB_URL,
        entities: Object.values(mikroOrmEntities),
        schema: schema !== null && schema !== void 0 ? schema : process.env.MEDUSA_DB_SCHEMA,
        debug: false,
        migrations: {
            pathTs: pathToMigrations,
            silent: true,
        },
    };
}
exports.getMikroOrmConfig = getMikroOrmConfig;
function getMikroOrmWrapper(_a) {
    var mikroOrmEntities = _a.mikroOrmEntities, pathToMigrations = _a.pathToMigrations, clientUrl = _a.clientUrl, schema = _a.schema;
    return {
        mikroOrmEntities: mikroOrmEntities,
        pathToMigrations: pathToMigrations,
        clientUrl: clientUrl !== null && clientUrl !== void 0 ? clientUrl : getDatabaseURL(),
        schema: schema !== null && schema !== void 0 ? schema : process.env.MEDUSA_DB_SCHEMA,
        orm: null,
        manager: null,
        getManager: function () {
            if (this.manager === null) {
                throw new Error("manager entity not available");
            }
            return this.manager;
        },
        forkManager: function () {
            if (this.manager === null) {
                throw new Error("manager entity not available");
            }
            return this.manager.fork();
        },
        getOrm: function () {
            if (this.orm === null) {
                throw new Error("orm entity not available");
            }
            return this.orm;
        },
        setupDatabase: function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var OrmConfig, _c, err_1, pendingMigrations;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            OrmConfig = getMikroOrmConfig({
                                mikroOrmEntities: this.mikroOrmEntities,
                                pathToMigrations: this.pathToMigrations,
                                clientUrl: this.clientUrl,
                                schema: this.schema,
                            });
                            // Initializing the ORM
                            _c = this;
                            return [4 /*yield*/, postgresql_1.MikroORM.init(OrmConfig)];
                        case 1:
                            // Initializing the ORM
                            _c.orm = _d.sent();
                            this.manager = this.orm.em;
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.orm.getSchemaGenerator().ensureDatabase()];
                        case 3:
                            _d.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _d.sent();
                            console.log(err_1);
                            return [3 /*break*/, 5];
                        case 5: return [4 /*yield*/, ((_a = this.manager) === null || _a === void 0 ? void 0 : _a.execute("CREATE SCHEMA IF NOT EXISTS \"".concat((_b = this.schema) !== null && _b !== void 0 ? _b : "public", "\";")))];
                        case 6:
                            _d.sent();
                            return [4 /*yield*/, this.orm
                                    .getMigrator()
                                    .getPendingMigrations()];
                        case 7:
                            pendingMigrations = _d.sent();
                            if (!(pendingMigrations && pendingMigrations.length > 0)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.orm
                                    .getMigrator()
                                    .up({ migrations: pendingMigrations.map(function (m) { return m.name; }) })];
                        case 8:
                            _d.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, this.orm.schema.refreshDatabase()]; // ensure db exists and is fresh
                        case 10:
                            _d.sent(); // ensure db exists and is fresh
                            _d.label = 11;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        },
        clearDatabase: function () {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function () {
                var _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (this.orm === null) {
                                throw new Error("ORM not configured");
                            }
                            return [4 /*yield*/, ((_a = this.manager) === null || _a === void 0 ? void 0 : _a.execute("DROP SCHEMA IF EXISTS \"".concat((_b = this.schema) !== null && _b !== void 0 ? _b : "public", "\" CASCADE;")))];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, ((_c = this.manager) === null || _c === void 0 ? void 0 : _c.execute("CREATE SCHEMA IF NOT EXISTS \"".concat((_d = this.schema) !== null && _d !== void 0 ? _d : "public", "\";")))];
                        case 2:
                            _f.sent();
                            _f.label = 3;
                        case 3:
                            _f.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.orm.close()];
                        case 4:
                            _f.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _e = _f.sent();
                            return [3 /*break*/, 6];
                        case 6:
                            this.orm = null;
                            this.manager = null;
                            return [2 /*return*/];
                    }
                });
            });
        },
    };
}
exports.getMikroOrmWrapper = getMikroOrmWrapper;
//# sourceMappingURL=database.js.map