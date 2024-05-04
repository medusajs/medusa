"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducts = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
async function createProducts({ container, data, }) {
    const data_ = data.products;
    const productModuleService = container.resolve(modules_sdk_1.ModulesDefinition[modules_sdk_1.Modules.PRODUCT].registrationName);
    return await productModuleService.create(data_);
}
exports.createProducts = createProducts;
createProducts.aliases = {
    payload: "payload",
};
