"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchProductVariantsWorkflow = exports.batchProductVariantsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const batch_product_variants_1 = require("../steps/batch-product-variants");
exports.batchProductVariantsWorkflowId = "batch-product-variants";
exports.batchProductVariantsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchProductVariantsWorkflowId, (input) => {
    return (0, batch_product_variants_1.batchProductVariantsStep)(input);
});
