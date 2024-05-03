"use strict";
exports.__esModule = true;
exports.loadConfig = void 0;
var medusa_core_utils_1 = require("medusa-core-utils");
var loadConfig = function (isDev) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var configModule = (0, medusa_core_utils_1.getConfigFile)(process.cwd(), "medusa-config").configModule;
    var plugin = configModule.plugins.find(function (p) {
        return (typeof p === "string" && p === "@medusajs/admin") ||
            (typeof p === "object" && p.resolve === "@medusajs/admin");
    });
    if (!plugin) {
        return null;
    }
    var config = {
        serve: true,
        autoRebuild: false,
        path: isDev ? "/" : "/app",
        outDir: "build",
        backend: isDev ? "http://localhost:9000" : "/",
        develop: {
            open: true,
            port: 7001,
            allowedHosts: 'auto'
        }
    };
    if (typeof plugin !== "string") {
        var options = (_a = plugin.options) !== null && _a !== void 0 ? _a : {};
        var serve = options.serve !== undefined ? options.serve : config.serve;
        var serverUrl = serve
            ? config.backend
            : options.backend
                ? options.backend
                : "/";
        config = {
            serve: serve,
            autoRebuild: (_b = options.autoRebuild) !== null && _b !== void 0 ? _b : config.autoRebuild,
            path: (_c = options.path) !== null && _c !== void 0 ? _c : config.path,
            outDir: (_d = options.outDir) !== null && _d !== void 0 ? _d : config.outDir,
            backend: serverUrl,
            develop: {
                open: (_f = (_e = options.develop) === null || _e === void 0 ? void 0 : _e.open) !== null && _f !== void 0 ? _f : config.develop.open,
                port: (_h = (_g = options.develop) === null || _g === void 0 ? void 0 : _g.port) !== null && _h !== void 0 ? _h : config.develop.port,
                allowedHosts: (_k = (_j = options.develop) === null || _j === void 0 ? void 0 : _j.allowedHosts) !== null && _k !== void 0 ? _k : config.develop.allowedHosts,
                webSocketURL: (_m = (_l = options.develop) === null || _l === void 0 ? void 0 : _l.webSocketURL) !== null && _m !== void 0 ? _m : config.develop.webSocketURL
            }
        };
    }
    return config;
};
exports.loadConfig = loadConfig;
