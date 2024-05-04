"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsStep = exports.getProductsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.getProductsStepId = "get-products";
exports.getProductsStep = (0, workflows_sdk_1.createStep)(exports.getProductsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const products = await service.list({ id: data.ids }, { relations: ["variants"], take: null });
    return new workflows_sdk_1.StepResponse(products, products);
});
