"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = void 0;
async function listProducts({ container, context, data, }) {
    const { manager } = context;
    const productIds = data.ids;
    const listConfig = data.config?.listConfig ?? {};
    const productService = container.resolve("productService");
    const pricingService = container.resolve("pricingService");
    const config = {};
    let shouldUseConfig = false;
    if (listConfig.select) {
        shouldUseConfig = !!listConfig.select.length;
        Object.assign(config, { select: listConfig.select });
    }
    if (listConfig.relations) {
        shouldUseConfig = shouldUseConfig || !!listConfig.relations.length;
        Object.assign(config, { relations: listConfig.relations });
    }
    const rawProducts = await productService
        .withTransaction(manager)
        .list({ id: productIds }, shouldUseConfig ? config : undefined);
    return await pricingService
        .withTransaction(manager)
        .setProductPrices(rawProducts);
}
exports.listProducts = listProducts;
listProducts.aliases = {
    ids: "ids",
};
