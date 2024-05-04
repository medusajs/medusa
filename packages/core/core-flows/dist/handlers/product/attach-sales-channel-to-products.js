"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachSalesChannelToProducts = void 0;
const utils_1 = require("@medusajs/utils");
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function attachSalesChannelToProducts({ container, context, data, }) {
    const { manager } = context;
    const featureFlagRouter = container.resolve("featureFlagRouter");
    const productsHandleSalesChannelsMap = data.productsHandleSalesChannelsMap;
    const products = data.products;
    const salesChannelService = container.resolve("salesChannelService");
    const salesChannelServiceTx = salesChannelService.withTransaction(manager);
    const salesChannelIdProductIdsMap = new Map();
    products.forEach((product) => {
        const salesChannelIds = productsHandleSalesChannelsMap.get(product.handle);
        if (salesChannelIds) {
            salesChannelIds.forEach((salesChannelId) => {
                const productIds = salesChannelIdProductIdsMap.get(salesChannelId) || [];
                productIds.push(product.id);
                salesChannelIdProductIdsMap.set(salesChannelId, productIds);
            });
        }
    });
    if (featureFlagRouter.isFeatureEnabled(utils_1.MedusaV2Flag.key)) {
        const remoteLink = container.resolve("remoteLink");
        const links = [];
        for (const [salesChannelId, productIds,] of salesChannelIdProductIdsMap.entries()) {
            productIds.forEach((id) => links.push({
                [modules_sdk_1.Modules.PRODUCT]: {
                    product_id: id,
                },
                [modules_sdk_1.Modules.SALES_CHANNEL]: {
                    sales_channel_id: salesChannelId,
                },
            }));
            await remoteLink.create(links);
        }
        return;
    }
    else {
        await (0, utils_1.promiseAll)(Array.from(salesChannelIdProductIdsMap.entries()).map(async ([salesChannelId, productIds]) => {
            return await salesChannelServiceTx.addProducts(salesChannelId, productIds);
        }));
    }
}
exports.attachSalesChannelToProducts = attachSalesChannelToProducts;
attachSalesChannelToProducts.aliases = {
    products: "products",
};
