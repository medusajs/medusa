"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePricingRuleTypesWorkflow = exports.updatePricingRuleTypesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updatePricingRuleTypesWorkflowId = "update-pricing-rule-types";
exports.updatePricingRuleTypesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updatePricingRuleTypesWorkflowId, (input) => {
    return (0, steps_1.updatePricingRuleTypesStep)(input.data);
});
