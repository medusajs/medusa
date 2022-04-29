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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var rax = __importStar(require("retry-axios"));
var uuid_1 = require("uuid");
var qs = __importStar(require("qs"));
var unAuthenticatedAdminEndpoints = {
    "/admin/auth": "POST",
    "/admin/users/password-token": "POST",
    "/admin/users/reset-password": "POST",
    "/admin/invites/accept": "POST",
};
var AxiosClient = /** @class */ (function () {
    function AxiosClient(config) {
        this.instance = this.createClient(config);
        this.config = config;
    }
    AxiosClient.prototype.createClient = function (config) {
        var _this = this;
        var client = axios_1.default.create({
            baseURL: config.baseUrl,
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: "comma" });
            },
        });
        rax.attach(client);
        client.defaults.raxConfig = {
            instance: client,
            retry: config.maxRetries,
            backoffType: "exponential",
            shouldRetry: function (err) {
                var _a, _b;
                var cfg = rax.getConfig(err);
                if (cfg) {
                    return _this.shouldRetryCondition(err, (_a = cfg.currentRetryAttempt) !== null && _a !== void 0 ? _a : 1, (_b = cfg.retry) !== null && _b !== void 0 ? _b : 3);
                }
                else {
                    return false;
                }
            },
        };
        return client;
    };
    AxiosClient.prototype.shouldRetryCondition = function (err, numRetries, maxRetries) {
        // Obviously, if we have reached max. retries we stop
        if (numRetries >= maxRetries) {
            return false;
        }
        // If no response, we assume a connection error and retry
        if (!err.response) {
            return true;
        }
        // Retry on conflicts
        if (err.response.status === 409) {
            return true;
        }
        // All 5xx errors are retried
        // OBS: We are currently not retrying 500 requests, since our core needs proper error handling.
        //      At the moment, 500 will be returned on all errors, that are not of type MedusaError.
        if (err.response.status > 500 && err.response.status <= 599) {
            return true;
        }
        return false;
    };
    AxiosClient.prototype.normalizeHeaders = function (obj) {
        var _this = this;
        if (!(obj && typeof obj === "object")) {
            return {};
        }
        return Object.keys(obj).reduce(function (result, header) {
            result[_this.normalizeHeader(header)] = obj[header];
            return result;
        }, {});
    };
    AxiosClient.prototype.normalizeHeader = function (header) {
        return header
            .split("-")
            .map(function (text) { return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase(); })
            .join("-");
    };
    AxiosClient.prototype.requiresAuthentication = function (path, method) {
        return (path.startsWith("/admin") &&
            unAuthenticatedAdminEndpoints[path] !== method);
    };
    AxiosClient.prototype.setHeaders = function (config) {
        var headers = config.headers, path = config.url, method = config.method;
        var defaultHeaders = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        if (this.config.apiKey && this.requiresAuthentication(path, method)) {
            defaultHeaders = __assign(__assign({}, defaultHeaders), { Authorization: "Bearer ".concat(this.config.apiKey) });
        }
        // only add idempotency key, if we want to retry
        if (this.config.maxRetries > 0 && method === "POST") {
            defaultHeaders["Idempotency-Key"] = (0, uuid_1.v4)();
        }
        return Object.assign({}, defaultHeaders, this.normalizeHeaders(headers));
    };
    AxiosClient.prototype.request = function (config) {
        config = __assign(__assign({}, config), { headers: this.setHeaders(config) });
        var promise = this.instance(__assign({}, config)).then(function (_a) {
            var data = _a.data;
            return data;
        });
        return promise;
    };
    return AxiosClient;
}());
exports.default = AxiosClient;
//# sourceMappingURL=client.js.map