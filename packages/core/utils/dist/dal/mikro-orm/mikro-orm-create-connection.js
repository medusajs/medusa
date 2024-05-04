"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.mikroOrmCreateConnection = exports.TSMigrationGenerator = void 0;
var migrations_1 = require("@mikro-orm/migrations");
Object.defineProperty(exports, "TSMigrationGenerator", { enumerable: true, get: function () { return migrations_1.TSMigrationGenerator; } });
var common_1 = require("../../common");
// Monkey patch due to the compilation version issue which prevents us from creating a proper class that extends the TSMigrationGenerator
var originalCreateStatement = migrations_1.TSMigrationGenerator.prototype.createStatement;
/**
 * Safe migration generation for MikroORM
 *
 * @param sql The sql statement
 * @param padLeft The padding
 *
 * @example see test file
 */
migrations_1.TSMigrationGenerator.prototype.createStatement = function (sql, padLeft) {
    if ((0, common_1.isString)(sql)) {
        if (!sql.includes("create table if not exists")) {
            sql = sql.replace("create table", "create table if not exists");
        }
        if (!sql.includes("alter table if exists")) {
            sql = sql.replace("alter table", "alter table if exists");
        }
        if (!sql.includes("create index if not exists")) {
            sql = sql.replace("create index", "create index if not exists");
        }
        if (!sql.includes("drop index if exists")) {
            sql = sql.replace("drop index", "drop index if exists");
        }
        if (!sql.includes("create unique index if not exists")) {
            sql = sql.replace("create unique index", "create unique index if not exists");
        }
        if (!sql.includes("drop unique index if exists")) {
            sql = sql.replace("drop unique index", "drop unique index if exists");
        }
        if (!sql.includes("add column if not exists")) {
            sql = sql.replace("add column", "add column if not exists");
        }
        if (!sql.includes("alter column if exists exists")) {
            sql = sql.replace("alter column", "alter column if exists");
        }
        if (!sql.includes("drop column if exists")) {
            sql = sql.replace("drop column", "drop column if exists");
        }
        if (!sql.includes("drop constraint if exists")) {
            sql = sql.replace("drop constraint", "drop constraint if exists");
        }
    }
    return originalCreateStatement(sql, padLeft);
};
function mikroOrmCreateConnection(database, entities, pathToMigrations) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __awaiter(this, void 0, void 0, function () {
        var schema, driverOptions, clientUrl, MikroORM;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    schema = database.schema || "public";
                    driverOptions = (_a = database.driverOptions) !== null && _a !== void 0 ? _a : {
                        connection: { ssl: false },
                    };
                    clientUrl = database.clientUrl;
                    if (database.connection) {
                        // Reuse already existing connection
                        // It is important that the knex package version is the same as the one used by MikroORM knex package
                        driverOptions = database.connection;
                        clientUrl =
                            (_e = (_d = (_c = (_b = database.connection.context) === null || _b === void 0 ? void 0 : _b.client) === null || _c === void 0 ? void 0 : _c.config) === null || _d === void 0 ? void 0 : _d.connection) === null || _e === void 0 ? void 0 : _e.connectionString;
                        schema = (_h = (_g = (_f = database.connection.context) === null || _f === void 0 ? void 0 : _f.client) === null || _g === void 0 ? void 0 : _g.config) === null || _h === void 0 ? void 0 : _h.searchPath;
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@mikro-orm/postgresql")); })];
                case 1:
                    MikroORM = (_r.sent()).MikroORM;
                    return [4 /*yield*/, MikroORM.init({
                            discovery: { disableDynamicFileAccess: true },
                            entities: entities,
                            debug: (_l = (_j = database.debug) !== null && _j !== void 0 ? _j : (_k = process.env.NODE_ENV) === null || _k === void 0 ? void 0 : _k.startsWith("dev")) !== null && _l !== void 0 ? _l : false,
                            baseDir: process.cwd(),
                            clientUrl: clientUrl,
                            schema: schema,
                            driverOptions: driverOptions,
                            tsNode: process.env.APP_ENV === "development",
                            type: "postgresql",
                            filters: (_m = database.filters) !== null && _m !== void 0 ? _m : {},
                            migrations: {
                                disableForeignKeys: false,
                                path: pathToMigrations,
                                generator: migrations_1.TSMigrationGenerator,
                                silent: !((_q = (_o = database.debug) !== null && _o !== void 0 ? _o : (_p = process.env.NODE_ENV) === null || _p === void 0 ? void 0 : _p.startsWith("dev")) !== null && _q !== void 0 ? _q : false),
                            },
                            schemaGenerator: {
                                disableForeignKeys: false
                            },
                            pool: database.pool,
                        })];
                case 2: return [2 /*return*/, _r.sent()];
            }
        });
    });
}
exports.mikroOrmCreateConnection = mikroOrmCreateConnection;
//# sourceMappingURL=mikro-orm-create-connection.js.map