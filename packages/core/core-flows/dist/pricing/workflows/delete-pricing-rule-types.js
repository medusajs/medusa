"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePricingRuleTypesWorkflow = exports.deletePricingRuleTypesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deletePricingRuleTypesWorkflowId = "delete-pricing-rule-types";
exports.deletePricingRuleTypesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deletePricingRuleTypesWorkflowId, (input) => {
    (0, steps_1.deletePricingRuleTypesStep)(input.ids);
});
