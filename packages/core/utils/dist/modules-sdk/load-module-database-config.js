"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDatabaseConfig = void 0;
var common_1 = require("../common");
function getEnv(key, moduleName) {
    var _a, _b;
    var value = (_b = (_a = process.env["".concat(moduleName.toUpperCase(), "_").concat(key)]) !== null && _a !== void 0 ? _a : process.env["MEDUSA_".concat(key)]) !== null && _b !== void 0 ? _b : process.env["".concat(key)];
    return value !== null && value !== void 0 ? value : "";
}
function isModuleServiceInitializeOptions(obj) {
    return !!(obj === null || obj === void 0 ? void 0 : obj.database);
}
function getDefaultDriverOptions(clientUrl) {
    var _a, _b;
    var localOptions = {
        connection: {
            ssl: false,
        },
    };
    var remoteOptions = {
        connection: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    };
    if (clientUrl) {
        return clientUrl.match(/localhost/i) ? localOptions : remoteOptions;
    }
    return ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.match(/prod/i))
        ? remoteOptions
        : ((_b = process.env.NODE_ENV) === null || _b === void 0 ? void 0 : _b.match(/dev/i))
            ? localOptions
            : {};
}
function getDatabaseUrl(config) {
    var _a = config.database, clientUrl = _a.clientUrl, host = _a.host, port = _a.port, user = _a.user, password = _a.password, database = _a.database;
    if (host) {
        return "postgres://".concat(user, ":").concat(password, "@").concat(host, ":").concat(port, "/").concat(database);
    }
    return clientUrl;
}
/**
 * Load the config for the database connection. The options can be retrieved
 * e.g through PRODUCT_* (e.g PRODUCT_POSTGRES_URL) or * (e.g POSTGRES_URL) environment variables or the options object.
 * @param options
 * @param moduleName
 */
function loadDatabaseConfig(moduleName, options, silent) {
    var _a, _b, _c, _d, _e, _f;
    if (silent === void 0) { silent = false; }
    var clientUrl = (_b = (_a = options === null || options === void 0 ? void 0 : options.database) === null || _a === void 0 ? void 0 : _a.clientUrl) !== null && _b !== void 0 ? _b : getEnv("POSTGRES_URL", moduleName);
    var database = {
        clientUrl: clientUrl,
        schema: (_c = getEnv("POSTGRES_SCHEMA", moduleName)) !== null && _c !== void 0 ? _c : "public",
        driverOptions: JSON.parse(getEnv("POSTGRES_DRIVER_OPTIONS", moduleName) ||
            JSON.stringify(getDefaultDriverOptions(clientUrl))),
        debug: false,
        connection: undefined,
    };
    if (isModuleServiceInitializeOptions(options)) {
        database.clientUrl = getDatabaseUrl({
            database: __assign(__assign({}, options.database), { clientUrl: clientUrl }),
        });
        database.schema = (_d = options.database.schema) !== null && _d !== void 0 ? _d : database.schema;
        database.driverOptions =
            (_e = options.database.driverOptions) !== null && _e !== void 0 ? _e : getDefaultDriverOptions(database.clientUrl);
        database.debug = (_f = options.database.debug) !== null && _f !== void 0 ? _f : database.debug;
        database.connection = options.database.connection;
    }
    if (!database.clientUrl && !silent && !database.connection) {
        throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_ARGUMENT, "No database clientUrl provided. Please provide the clientUrl through the [MODULE]_POSTGRES_URL, MEDUSA_POSTGRES_URL or POSTGRES_URL environment variable or the options object in the initialize function.");
    }
    return database;
}
exports.loadDatabaseConfig = loadDatabaseConfig;
//# sourceMappingURL=load-module-database-config.js.map