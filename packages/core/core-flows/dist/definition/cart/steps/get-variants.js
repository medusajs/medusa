"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariantsStep = exports.getVariantsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.getVariantsStepId = "get-variants";
exports.getVariantsStep = (0, workflows_sdk_1.createStep)(exports.getVariantsStepId, async (data, { container }) => {
    const productModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const variants = await productModuleService.listVariants(data.filter, data.config);
    return new workflows_sdk_1.StepResponse(variants);
});
