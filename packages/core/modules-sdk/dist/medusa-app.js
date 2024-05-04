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
exports.MedusaAppMigrateUp = exports.MedusaApp = exports.loadModules = void 0;
const merge_1 = require("@graphql-tools/merge");
const schema_1 = require("@graphql-tools/schema");
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
const definitions_1 = require("./definitions");
const medusa_module_1 = require("./medusa-module");
const remote_link_1 = require("./remote-link");
const remote_query_1 = require("./remote-query");
const utils_2 = require("./utils");
const Servers = __importStar(require("./utils/servers"));
const LinkModulePackage = definitions_1.MODULE_PACKAGE_NAMES[definitions_1.Modules.LINK];
async function loadModules(modulesConfig, sharedContainer, migrationOnly = false, loaderOnly = false, workerMode = "server") {
    const allModules = {};
    await Promise.all(Object.keys(modulesConfig).map(async (moduleName) => {
        const mod = modulesConfig[moduleName];
        let path;
        let moduleExports = undefined;
        let declaration = {};
        let definition = undefined;
        if ((0, utils_1.isObject)(mod)) {
            const mod_ = mod;
            path = mod_.resolve ?? definitions_1.MODULE_PACKAGE_NAMES[moduleName];
            definition = mod_.definition;
            moduleExports = !(0, utils_1.isString)(mod_.resolve)
                ? mod_.resolve
                : undefined;
            declaration = { ...mod };
            delete declaration.definition;
        }
        else {
            path = definitions_1.MODULE_PACKAGE_NAMES[moduleName];
        }
        declaration.scope ?? (declaration.scope = types_1.MODULE_SCOPE.INTERNAL);
        if (declaration.scope === types_1.MODULE_SCOPE.INTERNAL &&
            !declaration.resources) {
            declaration.resources = types_1.MODULE_RESOURCE_TYPE.SHARED;
        }
        const loaded = (await medusa_module_1.MedusaModule.bootstrap({
            moduleKey: moduleName,
            defaultPath: path,
            declaration,
            sharedContainer,
            moduleDefinition: definition,
            moduleExports,
            migrationOnly,
            loaderOnly,
            workerMode,
        }));
        if (loaderOnly) {
            return;
        }
        const service = loaded[moduleName];
        sharedContainer.register({
            [service.__definition.registrationName]: (0, awilix_1.asValue)(service),
        });
        if (allModules[moduleName] && !Array.isArray(allModules[moduleName])) {
            allModules[moduleName] = [];
        }
        if (allModules[moduleName]) {
            ;
            allModules[moduleName].push(loaded[moduleName]);
        }
        else {
            allModules[moduleName] = loaded[moduleName];
        }
    }));
    return allModules;
}
exports.loadModules = loadModules;
async function initializeLinks({ config, linkModules, injectedDependencies, moduleExports, }) {
    try {
        const { initialize, runMigrations } = moduleExports ?? (await Promise.resolve(`${LinkModulePackage}`).then(s => __importStar(require(s))));
        const linkResolution = await initialize(config, linkModules, injectedDependencies);
        return { remoteLink: new remote_link_1.RemoteLink(), linkResolution, runMigrations };
    }
    catch (err) {
        console.warn("Error initializing link modules.", err);
        return {
            remoteLink: undefined,
            linkResolution: undefined,
            runMigrations: undefined,
        };
    }
}
function isMedusaModule(mod) {
    return typeof mod?.initialize === "function";
}
function cleanAndMergeSchema(loadedSchema) {
    const { schema: cleanedSchema, notFound } = (0, utils_2.cleanGraphQLSchema)(loadedSchema);
    const mergedSchema = (0, merge_1.mergeTypeDefs)(cleanedSchema);
    return { schema: (0, schema_1.makeExecutableSchema)({ typeDefs: mergedSchema }), notFound };
}
function getLoadedSchema() {
    return medusa_module_1.MedusaModule.getAllJoinerConfigs()
        .map((joinerConfig) => joinerConfig?.schema ?? "")
        .join("\n");
}
function registerCustomJoinerConfigs(servicesConfig) {
    for (const config of servicesConfig) {
        if (!config.serviceName || config.isReadOnlyLink) {
            continue;
        }
        medusa_module_1.MedusaModule.setJoinerConfig(config.serviceName, config);
    }
}
async function MedusaApp_({ sharedContainer, sharedResourcesConfig, servicesConfig, modulesConfigPath, modulesConfigFileName, modulesConfig, linkModules, remoteFetchData, injectedDependencies = {}, onApplicationStartCb, migrationOnly = false, loaderOnly = false, workerMode = "server", } = {}) {
    const sharedContainer_ = (0, utils_1.createMedusaContainer)({}, sharedContainer);
    const onApplicationShutdown = async () => {
        await (0, utils_1.promiseAll)([
            medusa_module_1.MedusaModule.onApplicationShutdown(),
            sharedContainer_.dispose(),
        ]);
    };
    const onApplicationPrepareShutdown = async () => {
        await (0, utils_1.promiseAll)([medusa_module_1.MedusaModule.onApplicationPrepareShutdown()]);
    };
    const modules = modulesConfig ??
        (await Promise.resolve(`${modulesConfigPath ??
            process.cwd() + (modulesConfigFileName ?? "/modules-config")}`).then(s => __importStar(require(s)))).default;
    const dbData = utils_1.ModulesSdkUtils.loadDatabaseConfig("medusa", sharedResourcesConfig, true);
    registerCustomJoinerConfigs(servicesConfig ?? []);
    if (sharedResourcesConfig?.database?.connection &&
        !injectedDependencies[utils_1.ContainerRegistrationKeys.PG_CONNECTION]) {
        injectedDependencies[utils_1.ContainerRegistrationKeys.PG_CONNECTION] =
            sharedResourcesConfig.database.connection;
    }
    else if (dbData.clientUrl &&
        !injectedDependencies[utils_1.ContainerRegistrationKeys.PG_CONNECTION]) {
        injectedDependencies[utils_1.ContainerRegistrationKeys.PG_CONNECTION] =
            utils_1.ModulesSdkUtils.createPgConnection({
                ...(sharedResourcesConfig?.database ?? {}),
                ...dbData,
            });
    }
    // remove the link module from the modules
    const linkModule = modules[LinkModulePackage] ?? modules[definitions_1.Modules.LINK];
    delete modules[LinkModulePackage];
    delete modules[definitions_1.Modules.LINK];
    let linkModuleOptions = {};
    if ((0, utils_1.isObject)(linkModule)) {
        linkModuleOptions = linkModule;
    }
    for (const injectedDependency of Object.keys(injectedDependencies)) {
        sharedContainer_.register({
            [injectedDependency]: (0, awilix_1.asValue)(injectedDependencies[injectedDependency]),
        });
    }
    const allModules = await loadModules(modules, sharedContainer_, migrationOnly, loaderOnly, workerMode);
    if (loaderOnly) {
        return {
            onApplicationShutdown,
            onApplicationPrepareShutdown,
            modules: allModules,
            link: undefined,
            query: async () => {
                throw new Error("Querying not allowed in loaderOnly mode");
            },
            runMigrations: async () => {
                throw new Error("Migrations not allowed in loaderOnly mode");
            },
        };
    }
    // Share Event bus with link modules
    injectedDependencies[definitions_1.ModuleRegistrationName.EVENT_BUS] =
        sharedContainer_.resolve(definitions_1.ModuleRegistrationName.EVENT_BUS, {
            allowUnregistered: true,
        });
    const { remoteLink, runMigrations: linkModuleMigration } = await initializeLinks({
        config: linkModuleOptions,
        linkModules,
        injectedDependencies,
        moduleExports: isMedusaModule(linkModule) ? linkModule : undefined,
    });
    const loadedSchema = getLoadedSchema();
    const { schema, notFound } = cleanAndMergeSchema(loadedSchema);
    const remoteQuery = new remote_query_1.RemoteQuery({
        servicesConfig,
        customRemoteFetchData: remoteFetchData,
    });
    const query = async (query, variables, options) => {
        return await remoteQuery.query(query, variables, options);
    };
    const runMigrations = async (linkModuleOptions) => {
        for (const moduleName of Object.keys(allModules)) {
            const moduleResolution = medusa_module_1.MedusaModule.getModuleResolutions(moduleName);
            if (!moduleResolution.options?.database) {
                moduleResolution.options ?? (moduleResolution.options = {});
                moduleResolution.options.database = {
                    ...(sharedResourcesConfig?.database ?? {}),
                };
            }
            await medusa_module_1.MedusaModule.migrateUp(moduleResolution.definition.key, moduleResolution.resolutionPath, moduleResolution.options, moduleResolution.moduleExports);
        }
        const linkModuleOpt = { ...(linkModuleOptions ?? {}) };
        linkModuleOpt.database ?? (linkModuleOpt.database = {
            ...(sharedResourcesConfig?.database ?? {}),
        });
        linkModuleMigration &&
            (await linkModuleMigration({
                options: linkModuleOpt,
                injectedDependencies,
            }));
    };
    return {
        onApplicationShutdown,
        onApplicationPrepareShutdown,
        modules: allModules,
        link: remoteLink,
        query,
        entitiesMap: schema.getTypeMap(),
        notFound,
        runMigrations,
        listen: async (protocol, port, options) => {
            const serverConstructor = Servers[protocol].default;
            await serverConstructor(sharedContainer_, allModules, query)(port, options);
        },
    };
}
async function MedusaApp(options = {}) {
    try {
        return await MedusaApp_(options);
    }
    finally {
        medusa_module_1.MedusaModule.onApplicationStart(options.onApplicationStartCb);
    }
}
exports.MedusaApp = MedusaApp;
async function MedusaAppMigrateUp(options = {}) {
    const migrationOnly = true;
    const { runMigrations } = await MedusaApp_({
        ...options,
        migrationOnly,
    });
    await runMigrations().finally(medusa_module_1.MedusaModule.clearInstances);
}
exports.MedusaAppMigrateUp = MedusaAppMigrateUp;
//# sourceMappingURL=medusa-app.js.map