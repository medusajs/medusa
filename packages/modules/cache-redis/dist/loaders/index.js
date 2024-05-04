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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var awilix_1 = require("awilix");
var ioredis_1 = __importDefault(require("ioredis"));
exports.default = (function (_a) {
    var container = _a.container, logger = _a.logger, options = _a.options;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, redisUrl, redisOptions, connection, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = options, redisUrl = _b.redisUrl, redisOptions = _b.redisOptions;
                    if (!redisUrl) {
                        throw Error("No `redisUrl` provided in `cacheService` module options. It is required for the Redis Cache Module.");
                    }
                    connection = new ioredis_1.default(redisUrl, __assign({ 
                        // Lazy connect to properly handle connection errors
                        lazyConnect: true }, (redisOptions !== null && redisOptions !== void 0 ? redisOptions : {})));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, connection.connect()];
                case 2:
                    _c.sent();
                    logger === null || logger === void 0 ? void 0 : logger.info("Connection to Redis in module 'cache-redis' established");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    logger === null || logger === void 0 ? void 0 : logger.error("An error occurred while connecting to Redis in module 'cache-redis': ".concat(err_1));
                    return [3 /*break*/, 4];
                case 4:
                    container.register({
                        cacheRedisConnection: (0, awilix_1.asValue)(connection),
                    });
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=index.js.map