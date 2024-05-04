"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductCategoryWorkflow = exports.createProductCategoryWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createProductCategoryWorkflowId = "create-product-category";
exports.createProductCategoryWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createProductCategoryWorkflowId, (input) => {
    const category = (0, steps_1.createProductCategoryStep)(input);
    return category;
});
