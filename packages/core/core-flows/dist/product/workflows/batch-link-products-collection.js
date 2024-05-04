"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchLinkProductsToCollectionWorkflow = exports.batchLinkProductsToCollectionWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const batch_link_products_collection_1 = require("../steps/batch-link-products-collection");
exports.batchLinkProductsToCollectionWorkflowId = "batch-link-products-to-collection";
exports.batchLinkProductsToCollectionWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchLinkProductsToCollectionWorkflowId, (input) => {
    return (0, batch_link_products_collection_1.batchLinkProductsToCollectionStep)(input);
});
