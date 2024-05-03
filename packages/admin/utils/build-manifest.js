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
exports.shouldBuild = exports.createBuildManifest = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var isNil_1 = __importDefault(require("lodash/isNil"));
var path_1 = __importDefault(require("path"));
var get_plugin_paths_1 = require("./get-plugin-paths");
var MANIFEST_PATH = path_1["default"].resolve(process.cwd(), ".cache", "admin-build-manifest.json");
function getPackageVersions(appDir) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonPath, dependencies, _err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageJsonPath = path_1["default"].resolve(appDir, "package.json");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_extra_1["default"].readJson(packageJsonPath)];
                case 2:
                    dependencies = (_a.sent()).dependencies;
                    return [2 /*return*/, {
                            dependencies: dependencies
                        }];
                case 3:
                    _err_1 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getLastTimeModifiedAt(appDir) {
    return __awaiter(this, void 0, void 0, function () {
        function processFolder(dir) {
            return __awaiter(this, void 0, void 0, function () {
                var files, _i, files_1, file, filePath, stats, mtimeMs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs_extra_1["default"].readdir(dir)];
                        case 1:
                            files = _a.sent();
                            _i = 0, files_1 = files;
                            _a.label = 2;
                        case 2:
                            if (!(_i < files_1.length)) return [3 /*break*/, 7];
                            file = files_1[_i];
                            filePath = path_1["default"].join(dir, file);
                            return [4 /*yield*/, fs_extra_1["default"].stat(filePath)];
                        case 3:
                            stats = _a.sent();
                            if (!stats.isDirectory()) return [3 /*break*/, 5];
                            return [4 /*yield*/, processFolder(filePath)]; // Recursively process subfolders
                        case 4:
                            _a.sent(); // Recursively process subfolders
                            return [3 /*break*/, 6];
                        case 5:
                            mtimeMs = stats.mtimeMs;
                            mostRecentTimestamp = Math.max(mostRecentTimestamp, mtimeMs);
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        var adminPath, mostRecentTimestamp, pathExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminPath = path_1["default"].resolve(appDir, "src", "admin");
                    mostRecentTimestamp = 0;
                    return [4 /*yield*/, fs_extra_1["default"].pathExists(adminPath)];
                case 1:
                    pathExists = _a.sent();
                    if (!pathExists) {
                        return [2 /*return*/, mostRecentTimestamp];
                    }
                    return [4 /*yield*/, processFolder(adminPath)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, mostRecentTimestamp];
            }
        });
    });
}
function createBuildManifest(appDir, options) {
    return __awaiter(this, void 0, void 0, function () {
        var packageVersions, lastModificationTime, plugins, dependencies, buildManifest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPackageVersions(appDir)];
                case 1:
                    packageVersions = _a.sent();
                    return [4 /*yield*/, getLastTimeModifiedAt(appDir)];
                case 2:
                    lastModificationTime = _a.sent();
                    return [4 /*yield*/, (0, get_plugin_paths_1.getPluginPaths)()];
                case 3:
                    plugins = _a.sent();
                    dependencies = packageVersions.dependencies;
                    buildManifest = {
                        dependencies: dependencies,
                        modifiedAt: lastModificationTime,
                        plugins: plugins,
                        options: options
                    };
                    return [4 /*yield*/, fs_extra_1["default"].outputFile(MANIFEST_PATH, JSON.stringify(buildManifest, null, 2))];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.createBuildManifest = createBuildManifest;
function shouldBuild(appDir, options) {
    return __awaiter(this, void 0, void 0, function () {
        var manifestExists, buildManifest, buildManifestDependencies, buildManifestModifiedAt, buildManifestPlugins, buildManifestOptions, optionsChanged, packageVersions, dependencies, dependenciesChanged, modifiedAt, lastModificationTimeChanged, plugins, pluginsChanged, _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, fs_extra_1["default"].pathExists(MANIFEST_PATH)];
                case 1:
                    manifestExists = _a.sent();
                    if (!manifestExists) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, fs_extra_1["default"].readJson(MANIFEST_PATH)];
                case 2:
                    buildManifest = _a.sent();
                    buildManifestDependencies = buildManifest.dependencies, buildManifestModifiedAt = buildManifest.modifiedAt, buildManifestPlugins = buildManifest.plugins, buildManifestOptions = buildManifest.options;
                    optionsChanged = !(0, isEqual_1["default"])(options, buildManifestOptions);
                    if (optionsChanged) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, getPackageVersions(appDir)];
                case 3:
                    packageVersions = _a.sent();
                    if (!packageVersions) {
                        return [2 /*return*/, true];
                    }
                    dependencies = packageVersions.dependencies;
                    dependenciesChanged = !(0, isEqual_1["default"])(dependencies, buildManifestDependencies);
                    if (dependenciesChanged) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, getLastTimeModifiedAt(appDir)];
                case 4:
                    modifiedAt = _a.sent();
                    if ((0, isNil_1["default"])(modifiedAt)) {
                        return [2 /*return*/, true];
                    }
                    lastModificationTimeChanged = modifiedAt !== buildManifestModifiedAt;
                    if (lastModificationTimeChanged) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, get_plugin_paths_1.getPluginPaths)()];
                case 5:
                    plugins = _a.sent();
                    pluginsChanged = !(0, isEqual_1["default"])(plugins, buildManifestPlugins);
                    if (pluginsChanged) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
                case 6:
                    _error_1 = _a.sent();
                    return [2 /*return*/, true];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.shouldBuild = shouldBuild;
