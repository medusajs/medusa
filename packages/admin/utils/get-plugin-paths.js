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
exports.getPluginPaths = void 0;
var admin_ui_1 = require("@medusajs/admin-ui");
var medusa_core_utils_1 = require("medusa-core-utils");
var path_1 = __importDefault(require("path"));
function hasEnabledUI(options) {
    return "enableUI" in options && options.enableUI === true;
}
function getPluginPaths() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, configModule, error, plugins, paths, _i, plugins_1, p, options;
        return __generator(this, function (_b) {
            _a = (0, medusa_core_utils_1.getConfigFile)(path_1["default"].resolve(process.cwd()), "medusa-config.js"), configModule = _a.configModule, error = _a.error;
            if (error) {
                admin_ui_1.logger.panic("Error loading `medusa-config.js`");
            }
            plugins = configModule.plugins || [];
            paths = [];
            for (_i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
                p = plugins_1[_i];
                if (typeof p === "string") {
                    continue;
                }
                else {
                    options = p.options || {};
                    /**
                     * While the feature is in beta, we only want to load plugins that have
                     * enabled the UI explicitly. In the future, we will flip this check so
                     * we only exclude plugins that have set `enableUI` to false.
                     */
                    if (hasEnabledUI(options)) {
                        paths.push(p.resolve);
                    }
                }
            }
            return [2 /*return*/, paths];
        });
    });
}
exports.getPluginPaths = getPluginPaths;
