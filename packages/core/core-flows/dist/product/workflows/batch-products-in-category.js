"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchLinkProductsToCategoryWorkflow = exports.batchLinkProductsToCategoryWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const batch_link_products_in_category_1 = require("../steps/batch-link-products-in-category");
exports.batchLinkProductsToCategoryWorkflowId = "batch-link-products-to-category";
exports.batchLinkProductsToCategoryWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchLinkProductsToCategoryWorkflowId, (
// eslint-disable-next-line max-len
input) => {
    return (0, batch_link_products_in_category_1.batchLinkProductsToCategoryStep)(input);
});
