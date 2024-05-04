"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductOptionsWorkflow = exports.deleteProductOptionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteProductOptionsWorkflowId = "delete-product-options";
exports.deleteProductOptionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteProductOptionsWorkflowId, (input) => {
    return (0, steps_1.deleteProductOptionsStep)(input.ids);
});
