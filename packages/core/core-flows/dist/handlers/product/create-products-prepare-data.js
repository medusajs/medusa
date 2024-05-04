"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductsPrepareData = void 0;
const utils_1 = require("@medusajs/utils");
async function createProductsPrepareData({ container, context, data, }) {
    const { manager } = context;
    let products = data.products;
    const shippingProfileService = container
        .resolve("shippingProfileService")
        .withTransaction(manager);
    const featureFlagRouter = container.resolve("featureFlagRouter");
    const salesChannelService = container
        .resolve("salesChannelService")
        .withTransaction(manager);
    const salesChannelFeatureFlagKey = utils_1.FeatureFlagUtils.SalesChannelFeatureFlag.key;
    const shippingProfileServiceTx = shippingProfileService.withTransaction(manager);
    const shippingProfiles = await shippingProfileServiceTx.list({
        type: [
            utils_1.ShippingProfileUtils.ShippingProfileType.DEFAULT,
            utils_1.ShippingProfileUtils.ShippingProfileType.GIFT_CARD,
        ],
    });
    const defaultShippingProfile = shippingProfiles.find((sp) => sp.type === utils_1.ShippingProfileUtils.ShippingProfileType.DEFAULT);
    const gitCardShippingProfile = shippingProfiles.find((sp) => sp.type === utils_1.ShippingProfileUtils.ShippingProfileType.GIFT_CARD);
    let defaultSalesChannel;
    if (featureFlagRouter.isFeatureEnabled(salesChannelFeatureFlagKey)) {
        defaultSalesChannel = await salesChannelService
            .withTransaction(manager)
            .retrieveDefault();
    }
    const productsHandleShippingProfileIdMap = new Map();
    const productsHandleSalesChannelsMap = new Map();
    const productsHandleVariantsIndexPricesMap = new Map();
    for (const product of products) {
        product.handle ?? (product.handle = (0, utils_1.kebabCase)(product.title));
        if (product.is_giftcard) {
            productsHandleShippingProfileIdMap.set(product.handle, gitCardShippingProfile.id);
        }
        else {
            productsHandleShippingProfileIdMap.set(product.handle, defaultShippingProfile.id);
        }
        if (featureFlagRouter.isFeatureEnabled(salesChannelFeatureFlagKey) &&
            !product.sales_channels?.length) {
            productsHandleSalesChannelsMap.set(product.handle, [
                defaultSalesChannel.id,
            ]);
        }
        else {
            productsHandleSalesChannelsMap.set(product.handle, product.sales_channels.map((s) => s.id));
        }
        if (product.variants) {
            const items = productsHandleVariantsIndexPricesMap.get(product.handle) ?? [];
            product.variants.forEach((variant, index) => {
                items.push({
                    index,
                    prices: variant.prices,
                });
            });
            productsHandleVariantsIndexPricesMap.set(product.handle, items);
        }
    }
    products = products.map((productData) => {
        delete productData.sales_channels;
        return productData;
    });
    return {
        products: products,
        productsHandleShippingProfileIdMap,
        productsHandleSalesChannelsMap,
        productsHandleVariantsIndexPricesMap,
    };
}
exports.createProductsPrepareData = createProductsPrepareData;
createProductsPrepareData.aliases = {
    payload: "payload",
};
