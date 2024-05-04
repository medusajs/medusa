"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPricingRuleTypesWorkflow = exports.createPricingRuleTypesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createPricingRuleTypesWorkflowId = "create-pricing-rule-types";
exports.createPricingRuleTypesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createPricingRuleTypesWorkflowId, (input) => {
    return (0, steps_1.createPricingRuleTypesStep)(input.data);
});
