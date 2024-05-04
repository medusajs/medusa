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
exports.createPgConnection = void 0;
var knex_1 = require("@mikro-orm/knex");
/**
 * Create a new knex (pg in the future) connection which can be reused and shared
 * @param options
 */
function createPgConnection(options) {
    var _a, _b, _c, _d, _e, _f, _g;
    var pool = options.pool, _h = options.schema, schema = _h === void 0 ? "public" : _h, clientUrl = options.clientUrl, driverOptions = options.driverOptions;
    var ssl = (_e = (_b = (_a = options.driverOptions) === null || _a === void 0 ? void 0 : _a.ssl) !== null && _b !== void 0 ? _b : (_d = (_c = options.driverOptions) === null || _c === void 0 ? void 0 : _c.connection) === null || _d === void 0 ? void 0 : _d.ssl) !== null && _e !== void 0 ? _e : false;
    return (0, knex_1.knex)({
        client: "pg",
        searchPath: schema,
        connection: {
            connectionString: clientUrl,
            ssl: ssl,
            idle_in_transaction_session_timeout: (_f = driverOptions === null || driverOptions === void 0 ? void 0 : driverOptions.idle_in_transaction_session_timeout) !== null && _f !== void 0 ? _f : undefined, // prevent null to be passed
        },
        pool: __assign(__assign({}, (pool !== null && pool !== void 0 ? pool : {})), { min: (_g = pool === null || pool === void 0 ? void 0 : pool.min) !== null && _g !== void 0 ? _g : 0 }),
    });
}
exports.createPgConnection = createPgConnection;
//# sourceMappingURL=create-pg-connection.js.map