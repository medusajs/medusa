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
exports.__esModule = true;
var admin_ui_1 = require("@medusajs/admin-ui");
var path_1 = require("path");
var utils_1 = require("../utils");
var build_manifest_1 = require("../utils/build-manifest");
function build(_a) {
    var backend = _a.backend, path = _a.path, outDir = _a.outDir, deployment = _a.deployment;
    return __awaiter(this, void 0, void 0, function () {
        var _b, configPath, configBackend, configOutDir, plugins, appDir, outDirOption, pathOption, backendOption;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (0, utils_1.loadConfig)(), configPath = _b.path, configBackend = _b.backend, configOutDir = _b.outDir;
                    return [4 /*yield*/, (0, utils_1.getPluginPaths)()];
                case 1:
                    plugins = _c.sent();
                    appDir = process.cwd();
                    outDirOption = (0, path_1.resolve)(appDir, outDir || configOutDir);
                    pathOption = deployment ? path || "/" : path || configPath;
                    backendOption = deployment
                        ? backend || process.env.MEDUSA_ADMIN_BACKEND_URL
                        : backend || configBackend;
                    return [4 /*yield*/, (0, admin_ui_1.clean)({
                            appDir: appDir,
                            outDir: outDirOption
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, admin_ui_1.build)({
                            appDir: appDir,
                            buildDir: outDirOption,
                            plugins: plugins,
                            options: {
                                path: pathOption,
                                backend: backendOption,
                                outDir: outDirOption
                            }
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, build_manifest_1.createBuildManifest)(appDir, {
                            outDir: outDir || configOutDir,
                            path: path || configPath,
                            backend: backend || configBackend,
                            deployment: deployment
                        })];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = build;
