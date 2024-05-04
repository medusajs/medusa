"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedusaModule = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const os_1 = require("os");
const loaders_1 = require("./loaders");
const awilix_1 = require("awilix");
const utils_2 = require("./loaders/utils");
const logger = {
    log: (a) => console.log(a),
    info: (a) => console.log(a),
    warn: (a) => console.warn(a),
    error: (a) => console.error(a),
};
class MedusaModule {
    static getLoadedModules(aliases) {
        return [...MedusaModule.modules_.entries()].map(([key]) => {
            if (aliases?.has(key)) {
                return MedusaModule.getModuleInstance(key, aliases.get(key));
            }
            return MedusaModule.getModuleInstance(key);
        });
    }
    static onApplicationStart(onApplicationStartCb) {
        for (const instances of MedusaModule.instances_.values()) {
            for (const instance of Object.values(instances)) {
                if (instance?.__hooks) {
                    instance.__hooks?.onApplicationStart
                        ?.bind(instance)()
                        .then(() => {
                        onApplicationStartCb?.();
                    })
                        .catch(() => {
                        // The module should handle this and log it
                        return void 0;
                    });
                }
            }
        }
    }
    static async onApplicationShutdown() {
        await (0, utils_1.promiseAll)([...MedusaModule.instances_.values()]
            .map((instances) => {
            return Object.values(instances).map((instance) => {
                return instance.__hooks?.onApplicationShutdown
                    ?.bind(instance)()
                    .catch(() => {
                    // The module should handle this and log it
                    return void 0;
                });
            });
        })
            .flat());
    }
    static async onApplicationPrepareShutdown() {
        await (0, utils_1.promiseAll)([...MedusaModule.instances_.values()]
            .map((instances) => {
            return Object.values(instances).map((instance) => {
                return instance.__hooks?.onApplicationPrepareShutdown
                    ?.bind(instance)()
                    .catch(() => {
                    // The module should handle this and log it
                    return void 0;
                });
            });
        })
            .flat());
    }
    static clearInstances() {
        MedusaModule.instances_.clear();
        MedusaModule.modules_.clear();
        MedusaModule.joinerConfig_.clear();
        MedusaModule.moduleResolutions_.clear();
    }
    static isInstalled(moduleKey, alias) {
        if (alias) {
            return (MedusaModule.modules_.has(moduleKey) &&
                MedusaModule.modules_.get(moduleKey).some((m) => m.alias === alias));
        }
        return MedusaModule.modules_.has(moduleKey);
    }
    static getJoinerConfig(moduleKey) {
        return MedusaModule.joinerConfig_.get(moduleKey);
    }
    static getAllJoinerConfigs() {
        return [...MedusaModule.joinerConfig_.values()];
    }
    static getModuleResolutions(moduleKey) {
        return MedusaModule.moduleResolutions_.get(moduleKey);
    }
    static getAllModuleResolutions() {
        return [...MedusaModule.moduleResolutions_.values()];
    }
    static setModuleResolution(moduleKey, resolution) {
        MedusaModule.moduleResolutions_.set(moduleKey, resolution);
        return resolution;
    }
    static setJoinerConfig(moduleKey, config) {
        MedusaModule.joinerConfig_.set(moduleKey, config);
        return config;
    }
    static getModuleInstance(moduleKey, alias) {
        if (!MedusaModule.modules_.has(moduleKey)) {
            return;
        }
        let mod;
        const modules = MedusaModule.modules_.get(moduleKey);
        if (alias) {
            mod = modules.find((m) => m.alias === alias);
            return MedusaModule.instances_.get(mod?.hash);
        }
        mod = modules.find((m) => m.main) ?? modules[0];
        return MedusaModule.instances_.get(mod?.hash);
    }
    static registerModule(moduleKey, loadedModule) {
        if (!MedusaModule.modules_.has(moduleKey)) {
            MedusaModule.modules_.set(moduleKey, []);
        }
        const modules = MedusaModule.modules_.get(moduleKey);
        if (modules.some((m) => m.alias === loadedModule.alias)) {
            throw new Error(`Module ${moduleKey} already registed as '${loadedModule.alias}'. Please choose a different alias.`);
        }
        if (loadedModule.main) {
            if (modules.some((m) => m.main)) {
                throw new Error(`Module ${moduleKey} already have a 'main' registered.`);
            }
        }
        modules.push(loadedModule);
        MedusaModule.modules_.set(moduleKey, modules);
    }
    static async bootstrap({ moduleKey, defaultPath, declaration, moduleExports, sharedContainer, moduleDefinition, injectedDependencies, migrationOnly, loaderOnly, workerMode, }) {
        const hashKey = (0, utils_1.simpleHash)((0, utils_1.stringifyCircular)({ moduleKey, defaultPath, declaration }));
        if (!loaderOnly && MedusaModule.instances_.has(hashKey)) {
            return MedusaModule.instances_.get(hashKey);
        }
        if (!loaderOnly && MedusaModule.loading_.has(hashKey)) {
            return MedusaModule.loading_.get(hashKey);
        }
        let finishLoading;
        let errorLoading;
        const loadingPromise = new Promise((resolve, reject) => {
            finishLoading = resolve;
            errorLoading = reject;
        });
        if (!loaderOnly) {
            MedusaModule.loading_.set(hashKey, loadingPromise);
        }
        let modDeclaration = declaration ??
            {};
        if (declaration?.scope !== types_1.MODULE_SCOPE.EXTERNAL) {
            modDeclaration = {
                scope: declaration?.scope || types_1.MODULE_SCOPE.INTERNAL,
                resources: declaration?.resources || types_1.MODULE_RESOURCE_TYPE.ISOLATED,
                resolve: defaultPath,
                options: declaration?.options ?? declaration,
                alias: declaration?.alias,
                main: declaration?.main,
                worker_mode: workerMode,
            };
        }
        // TODO: Only do that while legacy modules sharing the manager exists then remove the ternary in favor of createMedusaContainer({}, globalContainer)
        const container = modDeclaration.scope === types_1.MODULE_SCOPE.INTERNAL &&
            modDeclaration.resources === types_1.MODULE_RESOURCE_TYPE.SHARED
            ? sharedContainer ?? (0, utils_1.createMedusaContainer)()
            : (0, utils_1.createMedusaContainer)({}, sharedContainer);
        if (injectedDependencies) {
            for (const service in injectedDependencies) {
                container.register(service, (0, awilix_1.asValue)(injectedDependencies[service]));
                if (!container.hasRegistration(service)) {
                    container.register(service, (0, awilix_1.asValue)(injectedDependencies[service]));
                }
            }
        }
        const moduleResolutions = (0, loaders_1.registerMedusaModule)(moduleKey, modDeclaration, moduleExports, moduleDefinition);
        const logger_ = container.resolve("logger", { allowUnregistered: true }) ?? logger;
        try {
            await (0, loaders_1.moduleLoader)({
                container,
                moduleResolutions,
                logger: logger_,
                migrationOnly,
                loaderOnly,
            });
        }
        catch (err) {
            errorLoading(err);
            throw err;
        }
        const services = {};
        if (loaderOnly) {
            finishLoading(services);
            return services;
        }
        for (const resolution of Object.values(moduleResolutions)) {
            const keyName = resolution.definition.key;
            const registrationName = resolution.definition.registrationName;
            services[keyName] = container.resolve(registrationName);
            services[keyName].__definition = resolution.definition;
            if (resolution.definition.isQueryable) {
                const joinerConfig = await services[keyName].__joinerConfig();
                if (!joinerConfig.primaryKeys) {
                    logger_.warn(`Primary keys are not defined by the module ${keyName}. Setting default primary key to 'id'${os_1.EOL}`);
                    joinerConfig.primaryKeys = ["id"];
                }
                services[keyName].__joinerConfig = joinerConfig;
                MedusaModule.setJoinerConfig(keyName, joinerConfig);
            }
            MedusaModule.setModuleResolution(keyName, resolution);
            MedusaModule.registerModule(keyName, {
                key: keyName,
                hash: hashKey,
                alias: modDeclaration.alias ?? hashKey,
                main: !!modDeclaration.main,
                isLink: false,
            });
        }
        MedusaModule.instances_.set(hashKey, services);
        finishLoading(services);
        MedusaModule.loading_.delete(hashKey);
        return services;
    }
    static async bootstrapLink({ definition, declaration, moduleExports, injectedDependencies, }) {
        const moduleKey = definition.key;
        const hashKey = (0, utils_1.simpleHash)((0, utils_1.stringifyCircular)({ moduleKey, declaration }));
        if (MedusaModule.instances_.has(hashKey)) {
            return { [moduleKey]: MedusaModule.instances_.get(hashKey) };
        }
        if (MedusaModule.loading_.has(hashKey)) {
            return MedusaModule.loading_.get(hashKey);
        }
        let finishLoading;
        let errorLoading;
        MedusaModule.loading_.set(hashKey, new Promise((resolve, reject) => {
            finishLoading = resolve;
            errorLoading = reject;
        }));
        let modDeclaration = declaration ?? {};
        const moduleDefinition = {
            key: definition.key,
            registrationName: definition.key,
            dependencies: definition.dependencies,
            defaultPackage: "",
            label: definition.label,
            isRequired: false,
            isQueryable: true,
            defaultModuleDeclaration: definition.defaultModuleDeclaration,
        };
        modDeclaration = {
            resolve: "",
            options: declaration,
            alias: declaration?.alias,
            main: declaration?.main,
        };
        const container = (0, utils_1.createMedusaContainer)();
        if (injectedDependencies) {
            for (const service in injectedDependencies) {
                container.register(service, (0, awilix_1.asValue)(injectedDependencies[service]));
            }
        }
        const moduleResolutions = (0, loaders_1.registerMedusaLinkModule)(moduleDefinition, modDeclaration, moduleExports);
        const logger_ = container.resolve("logger", { allowUnregistered: true }) ?? logger;
        try {
            await (0, loaders_1.moduleLoader)({
                container,
                moduleResolutions,
                logger: logger_,
            });
        }
        catch (err) {
            errorLoading(err);
            throw err;
        }
        const services = {};
        for (const resolution of Object.values(moduleResolutions)) {
            const keyName = resolution.definition.key;
            const registrationName = resolution.definition.registrationName;
            services[keyName] = container.resolve(registrationName);
            services[keyName].__definition = resolution.definition;
            if (resolution.definition.isQueryable) {
                const joinerConfig = await services[keyName].__joinerConfig();
                services[keyName].__joinerConfig = joinerConfig;
                MedusaModule.setJoinerConfig(keyName, joinerConfig);
                if (!joinerConfig.isLink) {
                    throw new Error("MedusaModule.bootstrapLink must be used only for Link Modules");
                }
            }
            MedusaModule.setModuleResolution(keyName, resolution);
            MedusaModule.registerModule(keyName, {
                key: keyName,
                hash: hashKey,
                alias: modDeclaration.alias ?? hashKey,
                main: !!modDeclaration.main,
                isLink: true,
            });
        }
        MedusaModule.instances_.set(hashKey, services);
        finishLoading(services);
        MedusaModule.loading_.delete(hashKey);
        return services;
    }
    static async migrateUp(moduleKey, modulePath, options, moduleExports) {
        const moduleResolutions = (0, loaders_1.registerMedusaModule)(moduleKey, {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.ISOLATED,
            resolve: modulePath,
            options,
        });
        for (const mod in moduleResolutions) {
            const [migrateUp] = await (0, utils_2.loadModuleMigrations)(moduleResolutions[mod], moduleExports);
            if (typeof migrateUp === "function") {
                await migrateUp({
                    options,
                    logger,
                });
            }
        }
    }
    static async migrateDown(moduleKey, modulePath, options, moduleExports) {
        const moduleResolutions = (0, loaders_1.registerMedusaModule)(moduleKey, {
            scope: types_1.MODULE_SCOPE.INTERNAL,
            resources: types_1.MODULE_RESOURCE_TYPE.ISOLATED,
            resolve: modulePath,
            options,
        });
        for (const mod in moduleResolutions) {
            const [, migrateDown] = await (0, utils_2.loadModuleMigrations)(moduleResolutions[mod], moduleExports);
            if (typeof migrateDown === "function") {
                await migrateDown({
                    options,
                    logger,
                });
            }
        }
    }
}
exports.MedusaModule = MedusaModule;
MedusaModule.instances_ = new Map();
MedusaModule.modules_ = new Map();
MedusaModule.loading_ = new Map();
MedusaModule.joinerConfig_ = new Map();
MedusaModule.moduleResolutions_ = new Map();
global.MedusaModule ?? (global.MedusaModule = MedusaModule);
exports.MedusaModule = global.MedusaModule;
//# sourceMappingURL=medusa-module.js.map