"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductTypesWorkflow = exports.createProductTypesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createProductTypesWorkflowId = "create-product-types";
exports.createProductTypesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createProductTypesWorkflowId, (input) => {
    return (0, steps_1.createProductTypesStep)(input.product_types);
});
