"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductCategoryWorkflow = exports.updateProductCategoryWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_product_category_1 = require("../steps/update-product-category");
exports.updateProductCategoryWorkflowId = "update-product-category";
exports.updateProductCategoryWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateProductCategoryWorkflowId, (input) => {
    const category = (0, update_product_category_1.updateProductCategoryStep)(input);
    return category;
});
