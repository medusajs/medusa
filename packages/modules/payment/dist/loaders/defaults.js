"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async ({ container }) => {
    const providersToLoad = container.resolve("payment_providers");
    const paymentProviderService = container.resolve("paymentProviderService");
    const providers = await paymentProviderService.list({
        id: providersToLoad,
    });
    const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]));
    const providersToCreate = [];
    for (const id of providersToLoad) {
        if (loadedProvidersMap.has(id)) {
            continue;
        }
        providersToCreate.push({ id });
    }
    await paymentProviderService.create(providersToCreate);
};
