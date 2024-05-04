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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertMigration = exports.runMigrations = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const SalesChannelModels = __importStar(require("./models"));
const module_definition_1 = require("./module-definition");
exports.default = module_definition_1.moduleDefinition;
const migrationScriptOptions = {
    moduleName: modules_sdk_1.Modules.SALES_CHANNEL,
    models: SalesChannelModels,
    pathToMigrations: __dirname + "/migrations",
};
exports.runMigrations = utils_1.ModulesSdkUtils.buildMigrationScript(migrationScriptOptions);
exports.revertMigration = utils_1.ModulesSdkUtils.buildRevertMigrationScript(migrationScriptOptions);
__exportStar(require("./initialize"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./loaders"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./services"), exports);
