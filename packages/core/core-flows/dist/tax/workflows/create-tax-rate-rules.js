"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRateRulesWorkflow = exports.createTaxRateRulesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createTaxRateRulesWorkflowId = "create-tax-rate-rules";
exports.createTaxRateRulesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createTaxRateRulesWorkflowId, (input) => {
    return (0, steps_1.createTaxRateRulesStep)(input.rules);
});
