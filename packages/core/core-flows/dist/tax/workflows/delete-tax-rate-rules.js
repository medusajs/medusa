"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaxRateRulesWorkflow = exports.deleteTaxRateRulesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteTaxRateRulesWorkflowId = "delete-tax-rate-rules";
exports.deleteTaxRateRulesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteTaxRateRulesWorkflowId, (input) => {
    return (0, steps_1.deleteTaxRateRulesStep)(input.ids);
});
