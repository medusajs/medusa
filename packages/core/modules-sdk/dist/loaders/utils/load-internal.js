"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModuleMigrations = exports.loadInternalModule = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
async function loadInternalModule(container, resolution, logger, migrationOnly, loaderOnly) {
    const registrationName = !loaderOnly
        ? resolution.definition.registrationName
        : resolution.definition.registrationName + "__loaderOnly";
    const { resources } = resolution.moduleDeclaration;
    let loadedModule;
    try {
        // When loading manually, we pass the exports to be loaded, meaning that we do not need to import the package to find
        // the exports. This is useful when a package export an initialize function which will bootstrap itself and therefore
        // does not need to import the package that is currently being loaded as it would create a
        // circular reference.
        const modulePath = resolution.resolutionPath;
        if (resolution.moduleExports) {
            loadedModule = resolution.moduleExports;
        }
        else {
            loadedModule = await Promise.resolve(`${modulePath}`).then(s => __importStar(require(s)));
            loadedModule = loadedModule.default;
        }
    }
    catch (error) {
        if (resolution.definition.isRequired &&
            resolution.definition.defaultPackage) {
            return {
                error: new Error(`Make sure you have installed the default package: ${resolution.definition.defaultPackage}`),
            };
        }
        return { error };
    }
    if (!loadedModule?.service) {
        container.register({
            [registrationName]: (0, awilix_1.asValue)(undefined),
        });
        return {
            error: new Error("No service found in module. Make sure your module exports a service."),
        };
    }
    if (migrationOnly) {
        // Partially loaded module, only register the service __joinerConfig function to be able to resolve it later
        const moduleService = {
            __joinerConfig: loadedModule.service.prototype.__joinerConfig,
        };
        container.register({
            [registrationName]: (0, awilix_1.asValue)(moduleService),
        });
        return;
    }
    const localContainer = (0, utils_1.createMedusaContainer)();
    const dependencies = resolution?.dependencies ?? [];
    if (resources === types_1.MODULE_RESOURCE_TYPE.SHARED) {
        dependencies.push(utils_1.ContainerRegistrationKeys.MANAGER, utils_1.ContainerRegistrationKeys.CONFIG_MODULE, utils_1.ContainerRegistrationKeys.LOGGER, utils_1.ContainerRegistrationKeys.PG_CONNECTION);
    }
    for (const dependency of dependencies) {
        localContainer.register(dependency, (0, awilix_1.asFunction)(() => {
            return container.resolve(dependency, { allowUnregistered: true });
        }));
    }
    const moduleLoaders = loadedModule?.loaders ?? [];
    try {
        for (const loader of moduleLoaders) {
            await loader({
                container: localContainer,
                logger,
                options: resolution.options,
                dataLoaderOnly: loaderOnly,
            }, resolution.moduleDeclaration);
        }
    }
    catch (err) {
        container.register({
            [registrationName]: (0, awilix_1.asValue)(undefined),
        });
        return {
            error: new Error(`Loaders for module ${resolution.definition.label} failed: ${err.message}`),
        };
    }
    const moduleService = loadedModule.service;
    container.register({
        [registrationName]: (0, awilix_1.asFunction)((cradle) => {
            ;
            moduleService.__type = utils_1.MedusaModuleType;
            return new moduleService(localContainer.cradle, resolution.options, resolution.moduleDeclaration);
        }).singleton(),
    });
    if (loaderOnly) {
        // The expectation is only to run the loader as standalone, so we do not need to register the service and we need to cleanup all services
        const service = container.resolve(registrationName);
        await service.__hooks?.onApplicationPrepareShutdown();
        await service.__hooks?.onApplicationShutdown();
    }
}
exports.loadInternalModule = loadInternalModule;
async function loadModuleMigrations(resolution, moduleExports) {
    let loadedModule;
    try {
        loadedModule =
            moduleExports ?? (await Promise.resolve(`${resolution.resolutionPath}`).then(s => __importStar(require(s))));
        return [loadedModule.runMigrations, loadedModule.revertMigration];
    }
    catch {
        return [undefined, undefined];
    }
}
exports.loadModuleMigrations = loadModuleMigrations;
//# sourceMappingURL=load-internal.js.map