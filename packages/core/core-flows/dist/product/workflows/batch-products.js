"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchProductsWorkflow = exports.batchProductsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const batch_products_1 = require("../steps/batch-products");
exports.batchProductsWorkflowId = "batch-products";
exports.batchProductsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchProductsWorkflowId, (input) => {
    return (0, batch_products_1.batchProductsStep)(input);
});
