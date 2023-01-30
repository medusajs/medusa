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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var open_1 = __importDefault(require("open"));
var load_config_1 = require("../utils/load-config");
/**
 * If the admin is in development mode, we check if the `autoOpen` option is set to true.
 * If so, we open the browser to the admin dashboard.
 */
function adminDevLoader() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, dev, path, port, portIndex;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(process.env.NODE_ENV === "development")) return [3 /*break*/, 2];
                    _a = (0, load_config_1.loadConfig)(), dev = _a.dev, path = _a.path;
                    port = 9000;
                    if (process.argv.includes("--port") || process.argv.includes("-p")) {
                        portIndex = process.argv.indexOf("--port") || process.argv.indexOf("-p");
                        port = parseInt(process.argv[portIndex + 1]);
                    }
                    if (!(dev === null || dev === void 0 ? void 0 : dev.autoOpen)) return [3 /*break*/, 2];
                    /**
                     * Very naive way of opening the browser, which will result in the browser opening a new tab even if a tab is already open with the URL.
                     * It is possible to check if a tab is already open with the URL, and if so, focus that tab instead of opening a new one.
                     * However, this does not work when executed from a loader, as we open the browser before the admin is actually ready (server has started).
                     * Until we have a option to only run this code once the server has started, instead of during the loader step, we can revisit this.
                     */
                    return [4 /*yield*/, (0, open_1["default"])("http://localhost:".concat(port).concat(path))];
                case 1:
                    /**
                     * Very naive way of opening the browser, which will result in the browser opening a new tab even if a tab is already open with the URL.
                     * It is possible to check if a tab is already open with the URL, and if so, focus that tab instead of opening a new one.
                     * However, this does not work when executed from a loader, as we open the browser before the admin is actually ready (server has started).
                     * Until we have a option to only run this code once the server has started, instead of during the loader step, we can revisit this.
                     */
                    _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = adminDevLoader;
