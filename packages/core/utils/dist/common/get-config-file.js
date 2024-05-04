"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
/**
 * Attempts to resolve the config file in a given root directory.
 * @param {string} rootDir - the directory to find the config file in.
 * @param {string} configName - the name of the config file.
 * @return {object} an object containing the config module and its path as well as an error property if the config couldn't be loaded.
 */
function getConfigFile(rootDir, configName) {
    var configPath = (0, path_1.join)(rootDir, configName);
    var configFilePath = "";
    var configModule;
    var err;
    try {
        configFilePath = require.resolve(configPath);
        configModule = require(configFilePath);
    }
    catch (e) {
        err = e;
    }
    if (configModule && typeof configModule.default === "object") {
        configModule = configModule.default;
    }
    return { configModule: configModule, configFilePath: configFilePath, error: err };
}
exports.default = getConfigFile;
//# sourceMappingURL=get-config-file.js.map