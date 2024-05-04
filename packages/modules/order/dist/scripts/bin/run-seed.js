#!/usr/bin/env node
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
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const Models = __importStar(require("../../models"));
const os_1 = require("os");
const args = process.argv;
const path = args.pop();
exports.default = (async () => {
    const { config } = await Promise.resolve().then(() => __importStar(require("dotenv")));
    config();
    if (!path) {
        throw new Error(`filePath is required.${os_1.EOL}Example: medusa-order-seed <filePath>`);
    }
    const run = utils_1.ModulesSdkUtils.buildSeedScript({
        moduleName: modules_sdk_1.Modules.ORDER,
        models: Models,
        pathToMigrations: __dirname + "/../../migrations",
        seedHandler: async ({ manager, data }) => {
            // TODO: Add seed logic
        },
    });
    await run({ path });
})();
//# sourceMappingURL=run-seed.js.map