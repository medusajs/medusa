"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPackageManager = exports.getPackageManager = void 0;
const configstore_1 = __importDefault(require("configstore"));
const reporter_1 = __importDefault(require("../reporter"));
const config = new configstore_1.default(`medusa`, {}, { globalConfigPath: true });
const packageMangerConfigKey = `cli.packageManager`;
const getPackageManager = () => {
    return config.get(packageMangerConfigKey);
};
exports.getPackageManager = getPackageManager;
const setPackageManager = (packageManager) => {
    config.set(packageMangerConfigKey, packageManager);
    reporter_1.default.info(`Preferred package manager set to "${packageManager}"`);
};
exports.setPackageManager = setPackageManager;
//# sourceMappingURL=package-manager.js.map