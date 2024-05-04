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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleDefinition = exports.revertMigration = exports.runMigrations = void 0;
const _services_1 = require("./services");
const connection_1 = __importDefault(require("./loaders/connection"));
const container_1 = __importDefault(require("./loaders/container"));
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const ProductModels = __importStar(require("./models"));
const migrationScriptOptions = {
    moduleName: modules_sdk_1.Modules.PRODUCT,
    models: ProductModels,
    pathToMigrations: __dirname + "/migrations",
};
exports.runMigrations = utils_1.ModulesSdkUtils.buildMigrationScript(migrationScriptOptions);
exports.revertMigration = utils_1.ModulesSdkUtils.buildRevertMigrationScript(migrationScriptOptions);
const service = _services_1.ProductModuleService;
const loaders = [container_1.default, connection_1.default];
exports.moduleDefinition = {
    service,
    loaders,
    runMigrations: exports.runMigrations,
    revertMigration: exports.revertMigration,
};
