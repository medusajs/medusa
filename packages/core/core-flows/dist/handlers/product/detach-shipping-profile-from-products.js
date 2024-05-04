"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachShippingProfileFromProducts = void 0;
const utils_1 = require("@medusajs/utils");
async function detachShippingProfileFromProducts({ container, context, data, }) {
    const { manager } = context;
    const productsHandleShippingProfileIdMap = data.productsHandleShippingProfileIdMap;
    const products = data.products;
    const shippingProfileService = container.resolve("shippingProfileService");
    const shippingProfileServiceTx = shippingProfileService.withTransaction(manager);
    const profileIdProductIdsMap = new Map();
    products.forEach((product) => {
        const profileId = productsHandleShippingProfileIdMap.get(product.handle);
        if (profileId) {
            const productIds = profileIdProductIdsMap.get(profileId) || [];
            productIds.push(product.id);
            profileIdProductIdsMap.set(profileId, productIds);
        }
    });
    await (0, utils_1.promiseAll)(Array.from(profileIdProductIdsMap.entries()).map(async ([profileId, productIds]) => {
        return await shippingProfileServiceTx.removeProducts(profileId, productIds);
    }));
}
exports.detachShippingProfileFromProducts = detachShippingProfileFromProducts;
detachShippingProfileFromProducts.aliases = {
    products: "products",
};
