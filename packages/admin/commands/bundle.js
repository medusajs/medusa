"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.bundle = void 0;
var admin_ui_1 = require("@medusajs/admin-ui");
var plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
var plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
var plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
var plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
var plugin_virtual_1 = __importDefault(require("@rollup/plugin-virtual"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var rollup_1 = require("rollup");
var rollup_plugin_esbuild_1 = __importDefault(require("rollup-plugin-esbuild"));
var ts_dedent_1 = __importDefault(require("ts-dedent"));
function bundle() {
    return __awaiter(this, void 0, void 0, function () {
        var adminDir, pathExists, pkg, identifier, _a, routes, widgets, settings, widgetArray, routeArray, settingArray, extensionsArray, virtualEntry, dependencies, peerDependencies, external, dist, distExists, error_1, bundle_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    adminDir = path_1["default"].resolve(process.cwd(), "src", "admin");
                    return [4 /*yield*/, fs_extra_1["default"].pathExists(adminDir)];
                case 1:
                    pathExists = _b.sent();
                    if (!pathExists) {
                        admin_ui_1.logger.panic("The `src/admin` directory could not be found. It appears that your project does not contain any admin extensions.");
                    }
                    return [4 /*yield*/, fs_extra_1["default"].readJSON(path_1["default"].join(process.cwd(), "package.json"))];
                case 2:
                    pkg = _b.sent();
                    if (!pkg) {
                        admin_ui_1.logger.panic("The `package.json` file could not be found. Your project does not meet the requirements of a valid Medusa plugin.");
                    }
                    if (!pkg.name) {
                        admin_ui_1.logger.panic("The `package.json` does not contain a `name` field. Your project does not meet the requirements of a valid Medusa plugin.");
                    }
                    identifier = pkg.name;
                    return [4 /*yield*/, Promise.all([
                            (0, admin_ui_1.findAllValidRoutes)(path_1["default"].resolve(adminDir, "routes")),
                            (0, admin_ui_1.findAllValidWidgets)(path_1["default"].resolve(adminDir, "widgets")),
                            (0, admin_ui_1.findAllValidSettings)(path_1["default"].resolve(adminDir, "settings")),
                        ])];
                case 3:
                    _a = _b.sent(), routes = _a[0], widgets = _a[1], settings = _a[2];
                    widgetArray = widgets.map(function (file, index) {
                        return {
                            importStatement: "import Widget".concat(index, ", { config as widgetConfig").concat(index, " } from \"").concat((0, admin_ui_1.normalizePath)(file), "\""),
                            extension: "{ Component: Widget".concat(index, ", config: { ...widgetConfig").concat(index, ", type: \"widget\" } }")
                        };
                    });
                    routeArray = routes.map(function (route, index) {
                        return {
                            importStatement: (0, ts_dedent_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        import Route", "", " from \"", "\""], ["\n        import Route", "", " from \"", "\""])), index, route.hasConfig ? ", { config as routeConfig".concat(index, " }") : "", (0, admin_ui_1.normalizePath)(route.file)),
                            extension: "{\n                Component: Route".concat(index, ",\n                config: { path: \"").concat(route.path, "\", type: \"route\"").concat(route.hasConfig ? ", ...routeConfig".concat(index) : "", " }\n            }")
                        };
                    });
                    settingArray = settings.map(function (setting, index) {
                        return {
                            importStatement: (0, ts_dedent_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        import Setting", ", { config as settingConfig", " } from \"", "\""], ["\n        import Setting", ", { config as settingConfig", " } from \"", "\""])), index, index, (0, admin_ui_1.normalizePath)(setting.file)),
                            extension: "{ Component: Setting".concat(index, ", config: { path: \"").concat(setting.path, "\", type: \"setting\", ...settingConfig").concat(index, " } }")
                        };
                    });
                    extensionsArray = __spreadArray(__spreadArray(__spreadArray([], routeArray, true), settingArray, true), widgetArray, true);
                    virtualEntry = (0, ts_dedent_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    ", "\n\n    const entry = {\n      identifier: \"", "\",\n      extensions: [\n        ", "\n      ],\n    }\n\n    export default entry\n  "], ["\n    ", "\n\n    const entry = {\n      identifier: \"", "\",\n      extensions: [\n        ", "\n      ],\n    }\n\n    export default entry\n  "])), extensionsArray.map(function (e) { return e.importStatement; }).join("\n"), identifier, extensionsArray.map(function (e) { return e.extension; }).join(",\n"));
                    dependencies = Object.keys(pkg.dependencies || {});
                    peerDependencies = Object.keys(pkg.peerDependencies || {});
                    external = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], admin_ui_1.ALIASED_PACKAGES, true), dependencies, true), peerDependencies, true), [
                        "react/jsx-runtime",
                    ], false);
                    dist = path_1["default"].resolve(process.cwd(), "dist", "admin");
                    return [4 /*yield*/, fs_extra_1["default"].pathExists(dist)];
                case 4:
                    distExists = _b.sent();
                    if (!distExists) return [3 /*break*/, 8];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs_extra_1["default"].remove(dist)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _b.sent();
                    admin_ui_1.logger.panic("Failed to clean ".concat(dist, ". Make sure that you have write access to the folder."));
                    return [3 /*break*/, 8];
                case 8:
                    _b.trys.push([8, 12, , 13]);
                    return [4 /*yield*/, (0, rollup_1.rollup)({
                            input: ["entry"],
                            external: external,
                            plugins: [
                                (0, plugin_virtual_1["default"])({
                                    entry: virtualEntry
                                }),
                                (0, plugin_node_resolve_1.nodeResolve)({
                                    preferBuiltins: true,
                                    browser: true,
                                    extensions: [".mjs", ".js", ".json", ".node", "jsx", "ts", "tsx"]
                                }),
                                (0, plugin_commonjs_1["default"])(),
                                (0, rollup_plugin_esbuild_1["default"])({
                                    include: /\.[jt]sx?$/,
                                    exclude: /node_modules/,
                                    minify: process.env.NODE_ENV === "production",
                                    target: "es2017",
                                    jsxFactory: "React.createElement",
                                    jsxFragment: "React.Fragment",
                                    jsx: "automatic"
                                }),
                                (0, plugin_json_1["default"])(),
                                (0, plugin_replace_1["default"])({
                                    values: {
                                        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
                                    },
                                    preventAssignment: true
                                }),
                            ],
                            onwarn: function (warning, warn) {
                                var _a;
                                if (warning.code === "CIRCULAR_DEPENDENCY" &&
                                    ((_a = warning.ids) === null || _a === void 0 ? void 0 : _a.every(function (id) { return /\bnode_modules\b/.test(id); }))) {
                                    return;
                                }
                                warn(warning);
                            }
                        })["catch"](function (error) {
                            throw error;
                        })];
                case 9:
                    bundle_1 = _b.sent();
                    return [4 /*yield*/, bundle_1.write({
                            dir: path_1["default"].resolve(process.cwd(), "dist", "admin"),
                            chunkFileNames: "[name].js",
                            format: "esm",
                            exports: "named"
                        })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, bundle_1.close()];
                case 11:
                    _b.sent();
                    admin_ui_1.logger.info("The extension bundle has been built successfully");
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _b.sent();
                    admin_ui_1.logger.panic("Error encountered while building the extension bundle: ".concat(error_2), error_2);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.bundle = bundle;
var templateObject_1, templateObject_2, templateObject_3;
