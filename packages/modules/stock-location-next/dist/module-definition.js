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
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDefinition = void 0;
const StockLocationModels = __importStar(require("./models"));
const StockLocationRepostiories = __importStar(require("./repositories"));
const StockLocationServices = __importStar(require("./services"));
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const _services_1 = require("./services");
const migrationScriptOptions = {
    moduleName: modules_sdk_1.Modules.STOCK_LOCATION,
    models: StockLocationModels,
    pathToMigrations: __dirname + "/migrations",
};
const runMigrations = utils_1.ModulesSdkUtils.buildMigrationScript(migrationScriptOptions);
const revertMigration = utils_1.ModulesSdkUtils.buildRevertMigrationScript(migrationScriptOptions);
const containerLoader = utils_1.ModulesSdkUtils.moduleContainerLoaderFactory({
    moduleModels: StockLocationModels,
    moduleRepositories: StockLocationRepostiories,
    moduleServices: StockLocationServices,
});
const connectionLoader = utils_1.ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
    moduleName: modules_sdk_1.Modules.STOCK_LOCATION,
    moduleModels: Object.values(StockLocationModels),
    migrationsPath: __dirname + "/migrations",
});
const service = _services_1.StockLocationModuleService;
const loaders = [containerLoader, connectionLoader];
exports.moduleDefinition = {
    service,
    loaders,
    revertMigration,
    runMigrations,
};
