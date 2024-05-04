"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaxRegionsWorkflow = exports.deleteTaxRegionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteTaxRegionsWorkflowId = "delete-tax-regions";
exports.deleteTaxRegionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteTaxRegionsWorkflowId, (input) => {
    return (0, steps_1.deleteTaxRegionsStep)(input.ids);
});
