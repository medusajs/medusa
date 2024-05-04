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
exports.loadModuleProvider = exports.moduleProviderLoader = void 0;
const utils_1 = require("@medusajs/utils");
const awilix_1 = require("awilix");
async function moduleProviderLoader({ container, providers, registerServiceFn, }) {
    if (!providers?.length) {
        return;
    }
    await (0, utils_1.promiseAll)(providers.map(async (pluginDetails) => {
        await loadModuleProvider(container, pluginDetails, registerServiceFn);
    }));
}
exports.moduleProviderLoader = moduleProviderLoader;
async function loadModuleProvider(container, provider, registerServiceFn) {
    let loadedProvider;
    const pluginName = provider.resolve ?? provider.provider_name ?? "";
    try {
        loadedProvider = provider.resolve;
        if ((0, utils_1.isString)(provider.resolve)) {
            loadedProvider = await Promise.resolve(`${provider.resolve}`).then(s => __importStar(require(s)));
        }
    }
    catch (error) {
        throw new Error(`Unable to find plugin ${pluginName} -- perhaps you need to install its package?`);
    }
    loadedProvider = loadedProvider.default ?? loadedProvider;
    if (!loadedProvider?.services?.length) {
        throw new Error(`No services found in plugin ${provider.resolve} -- make sure your plugin has a default export of services.`);
    }
    const services = await (0, utils_1.promiseAll)(loadedProvider.services.map(async (service) => {
        const name = (0, utils_1.lowerCaseFirst)(service.name);
        if (registerServiceFn) {
            // Used to register the specific type of service in the provider
            await registerServiceFn(service, container, provider.options);
        }
        else {
            container.register({
                [name]: (0, awilix_1.asFunction)((cradle) => new service(cradle, provider.options), {
                    lifetime: service.LIFE_TIME || awilix_1.Lifetime.SCOPED,
                }),
            });
        }
        return service;
    }));
    return services;
}
exports.loadModuleProvider = loadModuleProvider;
//# sourceMappingURL=module-provider-loader.js.map