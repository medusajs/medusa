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
exports.buildSeedScript = void 0;
var os_1 = require("os");
var path_1 = require("path");
var dal_1 = require("../../dal");
var load_module_database_config_1 = require("../load-module-database-config");
/**
 * Utility function to build a seed script that will insert the seed data.
 * @param moduleName
 * @param models
 * @param pathToMigrations
 * @param seedHandler
 */
function buildSeedScript(_a) {
    var moduleName = _a.moduleName, models = _a.models, pathToMigrations = _a.pathToMigrations, seedHandler = _a.seedHandler;
    return function (_a) {
        var options = _a.options, logger = _a.logger, path = _a.path;
        return __awaiter(this, void 0, void 0, function () {
            var logger_, dataSeed, dbData, entities, orm, manager;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger_ = (logger !== null && logger !== void 0 ? logger : console);
                        logger_.info("Loading seed data from ".concat(path, "..."));
                        return [4 /*yield*/, Promise.resolve("".concat((0, path_1.resolve)(process.cwd(), path))).then(function (s) { return __importStar(require(s)); }).catch(function (e) {
                                logger_.error("Failed to load seed data from ".concat(path, ". Please, provide a relative path and check that you export the following productCategoriesData, productsData, variantsData.").concat(os_1.EOL).concat(e));
                                throw e;
                            })];
                    case 1:
                        dataSeed = _b.sent();
                        dbData = (0, load_module_database_config_1.loadDatabaseConfig)(moduleName, options);
                        entities = Object.values(models);
                        return [4 /*yield*/, (0, dal_1.mikroOrmCreateConnection)(dbData, entities, pathToMigrations)];
                    case 2:
                        orm = _b.sent();
                        manager = orm.em.fork();
                        try {
                            logger_.info("Inserting ".concat(moduleName, " data..."));
                            seedHandler({ manager: manager, logger: logger_, data: dataSeed });
                        }
                        catch (e) {
                            logger_.error("Failed to insert the seed data in the PostgreSQL database ".concat(dbData.clientUrl, ".").concat(os_1.EOL).concat(e));
                        }
                        return [4 /*yield*/, orm.close(true)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
}
exports.buildSeedScript = buildSeedScript;
//# sourceMappingURL=seed.js.map