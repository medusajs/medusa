"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductsWorkflow = exports.updateProductsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_products_1 = require("../steps/update-products");
exports.updateProductsWorkflowId = "update-products";
exports.updateProductsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateProductsWorkflowId, (input) => {
    // TODO: Delete price sets for removed variants
    // TODO Update sales channel links
    return (0, update_products_1.updateProductsStep)(input);
});
