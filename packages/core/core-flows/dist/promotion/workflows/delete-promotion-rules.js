"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromotionRulesWorkflow = exports.deletePromotionRulesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deletePromotionRulesWorkflowId = "delete-promotion-rules-workflow";
exports.deletePromotionRulesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deletePromotionRulesWorkflowId, (input) => {
    return (0, steps_1.removeRulesFromPromotionsStep)(input);
});
