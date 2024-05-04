"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProducts = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function removeProducts({ container, data, }) {
    if (!data.products.length) {
        return;
    }
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    await productModuleService.softDelete(data.products.map((p) => p.id));
}
exports.removeProducts = removeProducts;
removeProducts.aliases = {
    products: "products",
};
