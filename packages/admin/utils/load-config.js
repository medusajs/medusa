"use strict";
exports.__esModule = true;
exports.loadConfig = void 0;
var medusa_core_utils_1 = require("medusa-core-utils");
var reporter_1 = require("./reporter");
var loadConfig = function () {
    var configModule = (0, medusa_core_utils_1.getConfigFile)(process.cwd(), "medusa-config").configModule;
    var plugin = configModule.plugins.find(function (p) {
        return (typeof p === "string" && p === "@medusajs/admin") ||
            (typeof p === "object" && p.resolve === "@medusajs/admin");
    });
    if (!plugin) {
        reporter_1.reporter.error('Could not find "@medusajs/admin" in `medusa-config.js` file. Make sure to add it to the plugins array.');
        process.exit(1);
    }
    var defaultConfig = {
        serve: true,
        path: "/app",
        dev: {
            autoOpen: true
        }
    };
    if (typeof plugin !== "string") {
        var options = plugin.options;
        defaultConfig.path = options.path || defaultConfig.path;
        defaultConfig.serve = options.serve || defaultConfig.serve;
        defaultConfig.dev = options.dev || defaultConfig.dev;
        defaultConfig.build = options.build || defaultConfig.build;
    }
    return defaultConfig;
};
exports.loadConfig = loadConfig;
