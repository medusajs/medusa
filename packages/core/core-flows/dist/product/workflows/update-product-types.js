"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductTypesWorkflow = exports.updateProductTypesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateProductTypesWorkflowId = "update-product-types";
exports.updateProductTypesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateProductTypesWorkflowId, (input) => {
    return (0, steps_1.updateProductTypesStep)(input);
});
