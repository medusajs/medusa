"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRegionsWorkflow = exports.createTaxRegionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createTaxRegionsWorkflowId = "create-tax-regions";
exports.createTaxRegionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createTaxRegionsWorkflowId, (input) => {
    return (0, steps_1.createTaxRegionsStep)(input);
});
