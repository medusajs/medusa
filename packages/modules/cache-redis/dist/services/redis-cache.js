"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_NAMESPACE = "medusa";
var DEFAULT_CACHE_TIME = 30; // 30 seconds
var EXPIRY_MODE = "EX"; // "EX" stands for an expiry time in second
var RedisCacheService = /** @class */ (function () {
    function RedisCacheService(_a, options) {
        var _this = this;
        var cacheRedisConnection = _a.cacheRedisConnection;
        if (options === void 0) { options = {}; }
        var _b;
        this.__hooks = {
            onApplicationShutdown: function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.redis.disconnect();
                    return [2 /*return*/];
                });
            }); },
        };
        this.redis = cacheRedisConnection;
        this.TTL = (_b = options.ttl) !== null && _b !== void 0 ? _b : DEFAULT_CACHE_TIME;
        this.namespace = options.namespace || DEFAULT_NAMESPACE;
    }
    /**
     * Set a key/value pair to the cache.
     * If the ttl is 0 it will act like the value should not be cached at all.
     * @param key
     * @param data
     * @param ttl
     */
    RedisCacheService.prototype.set = function (key, data, ttl) {
        if (ttl === void 0) { ttl = this.TTL; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ttl === 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.redis.set(this.getCacheKey(key), JSON.stringify(data), EXPIRY_MODE, ttl)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve a cached value belonging to the given key.
     * @param cacheKey
     */
    RedisCacheService.prototype.get = function (cacheKey) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = this.getCacheKey(cacheKey);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.redis.get(cacheKey)];
                    case 2:
                        cached = _a.sent();
                        if (cached) {
                            return [2 /*return*/, JSON.parse(cached)];
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.redis.del(cacheKey)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Invalidate cache for a specific key. a key can be either a specific key or more global such as "ps:*".
     * @param key
     */
    RedisCacheService.prototype.invalidate = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, pipeline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.redis.keys(this.getCacheKey(key))];
                    case 1:
                        keys = _a.sent();
                        pipeline = this.redis.pipeline();
                        keys.forEach(function (key) {
                            pipeline.del(key);
                        });
                        return [4 /*yield*/, pipeline.exec()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns namespaced cache key
     * @param key
     */
    RedisCacheService.prototype.getCacheKey = function (key) {
        return this.namespace ? "".concat(this.namespace, ":").concat(key) : key;
    };
    return RedisCacheService;
}());
exports.default = RedisCacheService;
//# sourceMappingURL=redis-cache.js.map