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
const defaultProviders = __importStar(require("../providers"));
const awilix_1 = require("awilix");
exports.default = async ({ container, options, }) => {
    const providerMap = new Map(options?.providers?.map((provider) => [provider.name, provider.scopes]) ??
        []);
    // if(options?.providers?.length) {
    // TODO: implement plugin provider registration
    // }
    const providersToLoad = Object.values(defaultProviders);
    for (const provider of providersToLoad) {
        container.register({
            [`auth_provider_${provider.PROVIDER}`]: (0, awilix_1.asClass)(provider)
                .singleton()
                .inject(() => ({ scopes: providerMap.get(provider.PROVIDER) ?? {} })),
        });
    }
    container.register({
        [`auth_providers`]: asArray(providersToLoad, providerMap),
    });
};
function asArray(resolvers, providerScopeMap) {
    return {
        resolve: (container) => resolvers.map((resolver) => (0, awilix_1.asClass)(resolver)
            .inject(() => ({
            // @ts-ignore
            scopes: providerScopeMap.get(resolver.PROVIDER) ?? {},
        }))
            .resolve(container)),
    };
}
