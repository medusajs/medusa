"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromotionRulesWorkflowStep = exports.createPromotionRulesWorkflowStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_promotion_rules_1 = require("../workflows/create-promotion-rules");
exports.createPromotionRulesWorkflowStepId = "create-promotion-rules-workflow";
exports.createPromotionRulesWorkflowStep = (0, workflows_sdk_1.createStep)(exports.createPromotionRulesWorkflowStepId, async (data, { container }) => {
    const { transaction, result: created, errors, } = await (0, create_promotion_rules_1.createPromotionRulesWorkflow)(container).run({
        input: data,
        throwOnError: false,
    });
    if (errors?.length) {
        throw errors[0].error;
    }
    return new workflows_sdk_1.StepResponse(created, transaction);
}, async (transaction, { container }) => {
    if (!transaction) {
        return;
    }
    await (0, create_promotion_rules_1.createPromotionRulesWorkflow)(container).cancel({ transaction });
});
