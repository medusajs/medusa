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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModuleRepositories = exports.loadModuleServices = exports.moduleContainerLoaderFactory = void 0;
var awilix_1 = require("awilix");
var internal_module_service_factory_1 = require("../internal-module-service-factory");
var common_1 = require("../../common");
var dal_1 = require("../../dal");
/**
 * Factory for creating a container loader for a module.
 *
 * @param moduleModels
 * @param moduleServices
 * @param moduleRepositories
 * @param customRepositoryLoader The default repository loader is based on mikro orm. If you want to use a custom repository loader, you can pass it here.
 */
function moduleContainerLoaderFactory(_a) {
    var _this = this;
    var moduleModels = _a.moduleModels, moduleServices = _a.moduleServices, _b = _a.moduleRepositories, moduleRepositories = _b === void 0 ? {} : _b, _c = _a.customRepositoryLoader, customRepositoryLoader = _c === void 0 ? loadModuleRepositories : _c;
    return function (_a) {
        var container = _a.container, options = _a.options;
        return __awaiter(_this, void 0, void 0, function () {
            var customRepositories, repositoryLoader;
            return __generator(this, function (_b) {
                customRepositories = options === null || options === void 0 ? void 0 : options.repositories;
                loadModuleServices({
                    moduleModels: moduleModels,
                    moduleServices: moduleServices,
                    container: container,
                });
                repositoryLoader = customRepositoryLoader !== null && customRepositoryLoader !== void 0 ? customRepositoryLoader : loadModuleRepositories;
                repositoryLoader({
                    moduleModels: moduleModels,
                    moduleRepositories: moduleRepositories,
                    customRepositories: customRepositories !== null && customRepositories !== void 0 ? customRepositories : {},
                    container: container,
                });
                return [2 /*return*/];
            });
        });
    };
}
exports.moduleContainerLoaderFactory = moduleContainerLoaderFactory;
/**
 * Load the services from the module services object. If a service is not
 * present a default service will be created for the model.
 *
 * @param moduleModels
 * @param moduleServices
 * @param container
 */
function loadModuleServices(_a) {
    var moduleModels = _a.moduleModels, moduleServices = _a.moduleServices, container = _a.container;
    var moduleServicesMap = new Map(Object.entries(moduleServices).map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], repository = _b[1];
        return [
            (0, common_1.lowerCaseFirst)(key),
            repository,
        ];
    }));
    // Build default services for all models that are not present in the module services
    Object.values(moduleModels).forEach(function (Model) {
        var mappedServiceName = (0, common_1.lowerCaseFirst)(Model.name) + "Service";
        var finalService = moduleServicesMap.get(mappedServiceName);
        if (!finalService) {
            moduleServicesMap.set(mappedServiceName, (0, internal_module_service_factory_1.internalModuleServiceFactory)(Model));
        }
    });
    var allServices = __spreadArray([], __read(moduleServicesMap), false);
    allServices.forEach(function (_a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], service = _c[1];
        container.register((_b = {},
            _b[(0, common_1.lowerCaseFirst)(key)] = (0, awilix_1.asClass)(service).singleton(),
            _b));
    });
}
exports.loadModuleServices = loadModuleServices;
/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used from the module repository.
 * If none are present, a default repository will be created for the model.
 *
 * @param moduleModels
 * @param moduleRepositories
 * @param customRepositories
 * @param container
 */
function loadModuleRepositories(_a) {
    var moduleModels = _a.moduleModels, _b = _a.moduleRepositories, moduleRepositories = _b === void 0 ? {} : _b, customRepositories = _a.customRepositories, container = _a.container;
    var customRepositoriesMap = new Map(Object.entries(customRepositories).map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], repository = _b[1];
        return [
            (0, common_1.lowerCaseFirst)(key),
            repository,
        ];
    }));
    var moduleRepositoriesMap = new Map(Object.entries(moduleRepositories).map(function (_a) {
        var _b = __read(_a, 2), key = _b[0], repository = _b[1];
        return [
            (0, common_1.lowerCaseFirst)(key),
            repository,
        ];
    }));
    // Build default repositories for all models that are not present in the custom repositories or module repositories
    Object.values(moduleModels).forEach(function (Model) {
        var mappedRepositoryName = (0, common_1.lowerCaseFirst)(Model.name) + "Repository";
        var finalRepository = customRepositoriesMap.get(mappedRepositoryName);
        finalRepository !== null && finalRepository !== void 0 ? finalRepository : (finalRepository = moduleRepositoriesMap.get(mappedRepositoryName));
        if (!finalRepository) {
            moduleRepositoriesMap.set(mappedRepositoryName, (0, dal_1.mikroOrmBaseRepositoryFactory)(Model));
        }
    });
    var allRepositories = __spreadArray(__spreadArray([], __read(customRepositoriesMap), false), __read(moduleRepositoriesMap), false);
    allRepositories.forEach(function (_a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], repository = _c[1];
        var finalRepository = customRepositoriesMap.get(key);
        if (!finalRepository) {
            finalRepository = repository;
        }
        container.register((_b = {},
            _b[(0, common_1.lowerCaseFirst)(key)] = (0, awilix_1.asClass)(finalRepository).singleton(),
            _b));
    });
}
exports.loadModuleRepositories = loadModuleRepositories;
//# sourceMappingURL=container-loader-factory.js.map