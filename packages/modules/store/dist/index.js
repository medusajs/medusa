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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertMigration = exports.runMigrations = exports.initialize = void 0;
const module_definition_1 = require("./module-definition");
const modules_sdk_1 = require("@medusajs/modules-sdk");
__exportStar(require("./types"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./services"), exports);
exports.initialize = (0, modules_sdk_1.initializeFactory)({
    moduleName: modules_sdk_1.Modules.STORE,
    moduleDefinition: module_definition_1.moduleDefinition,
});
exports.runMigrations = module_definition_1.moduleDefinition.runMigrations;
exports.revertMigration = module_definition_1.moduleDefinition.revertMigration;
exports.default = module_definition_1.moduleDefinition;
