"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProductVariants = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function removeProductVariants({ container, data, }) {
    if (!data.productVariants.length) {
        return;
    }
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    await productModuleService.deleteVariants(data.productVariants.map((p) => p.id));
}
exports.removeProductVariants = removeProductVariants;
removeProductVariants.aliases = {
    productVariants: "productVariants",
};
