"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductOptionsWorkflow = exports.updateProductOptionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateProductOptionsWorkflowId = "update-product-options";
exports.updateProductOptionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateProductOptionsWorkflowId, (input) => {
    return (0, steps_1.updateProductOptionsStep)(input);
});
