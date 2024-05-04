"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariants = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function updateProductVariants({ container, data, }) {
    const { productVariantsMap } = data;
    const productsVariants = [];
    const updateVariantsData = [];
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    for (const [product_id, variantsUpdateData = []] of productVariantsMap) {
        updateVariantsData.push(...variantsUpdateData.map((update) => ({ ...update, product_id })));
        productsVariants.push(...variantsUpdateData);
    }
    if (updateVariantsData.length) {
        await productModuleService.upsertVariants(updateVariantsData);
    }
    return productsVariants;
}
exports.updateProductVariants = updateProductVariants;
updateProductVariants.aliases = {
    payload: "payload",
};
