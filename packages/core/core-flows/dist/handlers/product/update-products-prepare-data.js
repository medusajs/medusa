"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductsPrepareData = void 0;
const utils_1 = require("@medusajs/utils");
async function updateProductsPrepareData({ container, context, data, }) {
    const featureFlagRouter = container.resolve("featureFlagRouter");
    const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(utils_1.MedusaV2Flag.key);
    const variantPricesMap = new Map();
    const ids = data.products.map((product) => product.id);
    const productHandleAddedChannelsMap = new Map();
    const productHandleRemovedChannelsMap = new Map();
    const productService = container.resolve("productService");
    const productServiceTx = productService.withTransaction(context.manager);
    const products = await productServiceTx.list(
    // TODO: use RemoteQuery - sales_channels needs to be added to the joiner config
    { id: ids }, {
        relations: [
            "variants",
            "variants.options",
            "images",
            "options",
            "tags",
            "collection",
            "sales_channels",
        ],
        take: null,
    });
    const productsMap = new Map(products.map((product) => [product.id, product]));
    data.products.forEach((productInput) => {
        const removedChannels = [];
        const addedChannels = [];
        const currentProduct = productsMap.get(productInput.id);
        if (productInput.sales_channels) {
            productInput.sales_channels.forEach((channel) => {
                if (!currentProduct.sales_channels?.find((sc) => sc.id === channel.id)) {
                    addedChannels.push(channel.id);
                }
            });
            currentProduct.sales_channels?.forEach((channel) => {
                if (!productInput.sales_channels.find((sc) => sc.id === channel.id)) {
                    removedChannels.push(channel.id);
                }
            });
        }
        for (const variantInput of productInput.variants || []) {
            if (variantInput.id) {
                variantPricesMap.set(variantInput.id, variantInput.prices || []);
            }
            if (isPricingDomainEnabled) {
                delete variantInput.prices;
            }
        }
        productHandleAddedChannelsMap.set(currentProduct.handle, addedChannels);
        productHandleRemovedChannelsMap.set(currentProduct.handle, removedChannels);
    });
    return {
        originalProducts: products,
        productHandleAddedChannelsMap,
        productHandleRemovedChannelsMap,
        variantPricesMap,
    };
}
exports.updateProductsPrepareData = updateProductsPrepareData;
updateProductsPrepareData.aliases = {
    preparedData: "preparedData",
};
