"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductTypesWorkflow = exports.deleteProductTypesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteProductTypesWorkflowId = "delete-product-types";
exports.deleteProductTypesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteProductTypesWorkflowId, (input) => {
    return (0, steps_1.deleteProductTypesStep)(input.ids);
});
