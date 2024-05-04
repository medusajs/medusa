"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceListsWorkflow = exports.createPriceListsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createPriceListsWorkflowId = "create-price-lists";
exports.createPriceListsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createPriceListsWorkflowId, (input) => {
    const variantPriceMap = (0, steps_1.validateVariantPriceLinksStep)(input.price_lists_data);
    return (0, steps_1.createPriceListsStep)({
        data: input.price_lists_data,
        variant_price_map: variantPriceMap,
    });
});
