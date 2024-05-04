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
var DEFAULT_TTL = 30; // seconds
/**
 * Class represents basic, in-memory, cache store.
 */
var InMemoryCacheService = /** @class */ (function () {
    function InMemoryCacheService(deps, options) {
        if (options === void 0) { options = {}; }
        var _a;
        this.store = new Map();
        this.timoutRefs = new Map();
        this.TTL = (_a = options.ttl) !== null && _a !== void 0 ? _a : DEFAULT_TTL;
    }
    /**
     * Retrieve data from the cache.
     * @param key - cache key
     */
    InMemoryCacheService.prototype.get = function (key) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var now, record, recordExpire;
            return __generator(this, function (_b) {
                now = Date.now();
                record = this.store.get(key);
                recordExpire = (_a = record === null || record === void 0 ? void 0 : record.expire) !== null && _a !== void 0 ? _a : Infinity;
                if (!record || recordExpire < now) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, record.data];
            });
        });
    };
    /**
     * Set data to the cache.
     * @param key - cache key under which the data is stored
     * @param data - data to be stored in the cache
     * @param ttl - expiration time in seconds
     */
    InMemoryCacheService.prototype.set = function (key, data, ttl) {
        if (ttl === void 0) { ttl = this.TTL; }
        return __awaiter(this, void 0, void 0, function () {
            var record, oldRecord, ref;
            var _this = this;
            return __generator(this, function (_a) {
                if (ttl === 0) {
                    return [2 /*return*/];
                }
                record = { data: data, expire: ttl * 1000 + Date.now() };
                oldRecord = this.store.get(key);
                if (oldRecord) {
                    clearTimeout(this.timoutRefs.get(key));
                    this.timoutRefs.delete(key);
                }
                ref = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.invalidate(key)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, ttl * 1000);
                ref.unref();
                this.timoutRefs.set(key, ref);
                this.store.set(key, record);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Delete data from the cache.
     * Could use wildcard (*) matcher e.g. `invalidate("ps:*")` to delete all keys that start with "ps:"
     *
     * @param key - cache key
     */
    InMemoryCacheService.prototype.invalidate = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, regExp_1;
            var _this = this;
            return __generator(this, function (_a) {
                keys = [key];
                if (key.includes("*")) {
                    regExp_1 = new RegExp(key.replace("*", ".*"));
                    keys = Array.from(this.store.keys()).filter(function (k) { return k.match(regExp_1); });
                }
                keys.forEach(function (key) {
                    var timeoutRef = _this.timoutRefs.get(key);
                    if (timeoutRef) {
                        clearTimeout(timeoutRef);
                        _this.timoutRefs.delete(key);
                    }
                    _this.store.delete(key);
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Delete the entire cache.
     */
    InMemoryCacheService.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.timoutRefs.forEach(function (ref) { return clearTimeout(ref); });
                this.timoutRefs.clear();
                this.store.clear();
                return [2 /*return*/];
            });
        });
    };
    return InMemoryCacheService;
}());
exports.default = InMemoryCacheService;
//# sourceMappingURL=inmemory-cache.js.map