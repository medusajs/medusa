"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProducts = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function updateProducts({ container, context, data, }) {
    if (!data.products.length) {
        return [];
    }
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    const products = await productModuleService.upsert(data.products);
    return await productModuleService.list({ id: products.map((p) => p.id) }, {
        relations: [
            "variants",
            "variants.options",
            "images",
            "options",
            "tags",
            // "type",
            "collection",
            // "profiles",
            // "sales_channels",
        ],
        take: null,
    });
}
exports.updateProducts = updateProducts;
updateProducts.aliases = {
    products: "products",
};
