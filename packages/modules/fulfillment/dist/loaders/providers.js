"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const _services_1 = require("../services");
const _types_1 = require("../types");
const awilix_1 = require("awilix");
const registrationFn = async (klass, container, pluginOptions) => {
    Object.entries(pluginOptions.config || []).map(([name, config]) => {
        const key = _services_1.FulfillmentProviderService.getRegistrationIdentifier(klass, name);
        container.register({
            ["fp_" + key]: (0, awilix_1.asFunction)((cradle) => new klass(cradle, config), {
                lifetime: klass.LIFE_TIME || awilix_1.Lifetime.SINGLETON,
            }),
        });
        container.registerAdd(_types_1.FulfillmentIdentifiersRegistrationName, (0, awilix_1.asValue)(key));
    });
};
exports.default = async ({ container, options, }) => {
    container.registerAdd(_types_1.FulfillmentIdentifiersRegistrationName, (0, awilix_1.asValue)(undefined));
    // Local providers
    // TODO
    await (0, modules_sdk_1.moduleProviderLoader)({
        container,
        providers: options?.providers || [],
        registerServiceFn: registrationFn,
    });
    await syncDatabaseProviders({
        container,
    });
};
async function syncDatabaseProviders({ container }) {
    const providerServiceRegistrationKey = (0, utils_1.lowerCaseFirst)(_services_1.FulfillmentProviderService.name);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER) ?? console;
    try {
        const providerIdentifiers = (container.resolve(_types_1.FulfillmentIdentifiersRegistrationName) ?? []).filter(Boolean);
        const providerService = container.resolve(providerServiceRegistrationKey);
        const providers = await providerService.list({});
        const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]));
        const providersToCreate = providerIdentifiers.filter((id) => !loadedProvidersMap.has(id));
        const providersToEnabled = providerIdentifiers.filter((id) => loadedProvidersMap.has(id));
        const providersToDisable = providers.filter((p) => !providerIdentifiers.includes(p.id));
        const promises = [];
        if (providersToCreate.length) {
            promises.push(providerService.create(providersToCreate.map((id) => ({ id }))));
        }
        if (providersToEnabled.length) {
            promises.push(providerService.update(providersToEnabled.map((id) => ({ id, is_enabled: true }))));
        }
        if (providersToDisable.length) {
            promises.push(providerService.update(providersToDisable.map((p) => ({ id: p.id, is_enabled: false }))));
        }
        await (0, utils_1.promiseAll)(promises);
    }
    catch (error) {
        logger.error(`Error syncing the fulfillment providers: ${error.message}`);
    }
}
