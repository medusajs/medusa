var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _this = this;
var path = require("path");
var express = require("express");
var getPort = require("get-port");
var _a = require("@medusajs/utils"), isObject = _a.isObject, promiseAll = _a.promiseAll;
var GracefulShutdownServer = require("medusa-core-utils").GracefulShutdownServer;
function bootstrapApp(_a) {
    var _b = _a === void 0 ? {} : _a, cwd = _b.cwd, _c = _b.env, env = _c === void 0 ? {} : _c;
    return __awaiter(this, void 0, void 0, function () {
        var app, loaders, _d, container, shutdown, PORT;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    app = express();
                    if (isObject(env)) {
                        Object.entries(env).forEach(function (_a) {
                            var _b = __read(_a, 2), k = _b[0], v = _b[1];
                            return (process.env[k] = v);
                        });
                    }
                    loaders = require("@medusajs/medusa/dist/loaders").default;
                    return [4 /*yield*/, loaders({
                            directory: path.resolve(cwd || process.cwd()),
                            expressApp: app,
                            isTest: false,
                        })];
                case 1:
                    _d = _e.sent(), container = _d.container, shutdown = _d.shutdown;
                    return [4 /*yield*/, getPort()];
                case 2:
                    PORT = _e.sent();
                    return [2 /*return*/, {
                            shutdown: shutdown,
                            container: container,
                            app: app,
                            port: PORT,
                        }];
            }
        });
    });
}
module.exports = {
    startBootstrapApp: function (_a) {
        var _b = _a === void 0 ? {} : _a, cwd = _b.cwd, _c = _b.env, env = _c === void 0 ? {} : _c, _d = _b.skipExpressListen, skipExpressListen = _d === void 0 ? false : _d;
        return __awaiter(_this, void 0, void 0, function () {
            var _e, app, port, container, medusaShutdown, expressServer, shutdown;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, bootstrapApp({
                            cwd: cwd,
                            env: env,
                        })];
                    case 1:
                        _e = _f.sent(), app = _e.app, port = _e.port, container = _e.container, medusaShutdown = _e.shutdown;
                        if (skipExpressListen) {
                            return [2 /*return*/];
                        }
                        shutdown = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, promiseAll([expressServer.shutdown(), medusaShutdown()])];
                                    case 1:
                                        _a.sent();
                                        if (typeof global !== "undefined" && (global === null || global === void 0 ? void 0 : global.gc)) {
                                            global.gc();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var server = app.listen(port, function (err) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!err) return [3 /*break*/, 2];
                                                return [4 /*yield*/, shutdown()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, reject(err)];
                                            case 2:
                                                process.send(port);
                                                resolve({
                                                    shutdown: shutdown,
                                                    container: container,
                                                    port: port,
                                                });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                expressServer = GracefulShutdownServer.create(server);
                            })];
                    case 2: return [2 /*return*/, _f.sent()];
                }
            });
        });
    },
};
//# sourceMappingURL=bootstrap-app.js.map