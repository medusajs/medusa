"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductOptionsWorkflow = exports.createProductOptionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createProductOptionsWorkflowId = "create-product-options";
exports.createProductOptionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createProductOptionsWorkflowId, (input) => {
    return (0, steps_1.createProductOptionsStep)(input.product_options);
});
