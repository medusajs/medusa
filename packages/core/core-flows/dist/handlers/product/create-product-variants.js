"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductVariants = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function createProductVariants({ container, data, }) {
    const { productVariantsMap, variantIndexPricesMap } = data;
    const variantPricesMap = new Map();
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    const productVariants = await productModuleService.createVariants([...productVariantsMap.values()].flat());
    productVariants.forEach((variant, index) => {
        variantPricesMap.set(variant.id, variantIndexPricesMap.get(index) || []);
    });
    return {
        productVariants,
        variantPricesMap,
    };
}
exports.createProductVariants = createProductVariants;
createProductVariants.aliases = {
    payload: "payload",
};
