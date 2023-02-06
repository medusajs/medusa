"use strict";
exports.__esModule = true;
exports.loadConfig = void 0;
var medusa_core_utils_1 = require("medusa-core-utils");
var loadConfig = function () {
    var _a, _b, _c, _d, _e, _f;
    var configModule = (0, medusa_core_utils_1.getConfigFile)(process.cwd(), "medusa-config").configModule;
    var plugin = configModule.plugins.find(function (p) {
        return (typeof p === "string" && p === "@medusajs/admin") ||
            (typeof p === "object" && p.resolve === "@medusajs/admin");
    });
    var defaultConfig = {
        serve: true,
        path: "dashboard",
        dev: {
            autoOpen: true
        }
    };
    if (typeof plugin !== "string") {
        var options = plugin.options;
        defaultConfig = {
            serve: (_a = options.serve) !== null && _a !== void 0 ? _a : defaultConfig.serve,
            path: (_b = options.path) !== null && _b !== void 0 ? _b : defaultConfig.path,
            backend: (_c = options.backend) !== null && _c !== void 0 ? _c : defaultConfig.backend,
            outDir: (_d = options.outDir) !== null && _d !== void 0 ? _d : defaultConfig.outDir,
            dev: {
                autoOpen: (_f = (_e = options.dev) === null || _e === void 0 ? void 0 : _e.autoOpen) !== null && _f !== void 0 ? _f : defaultConfig.dev.autoOpen
            }
        };
    }
    return defaultConfig;
};
exports.loadConfig = loadConfig;
