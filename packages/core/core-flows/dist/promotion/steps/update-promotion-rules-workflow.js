"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromotionRulesWorkflowStep = exports.updatePromotionRulesWorkflowStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_promotion_rules_1 = require("../workflows/update-promotion-rules");
exports.updatePromotionRulesWorkflowStepId = "update-promotion-rules-workflow";
exports.updatePromotionRulesWorkflowStep = (0, workflows_sdk_1.createStep)(exports.updatePromotionRulesWorkflowStepId, async (data, { container }) => {
    const { transaction, result: updated, errors, } = await (0, update_promotion_rules_1.updatePromotionRulesWorkflow)(container).run({
        input: data,
        throwOnError: false,
    });
    if (errors?.length) {
        throw errors[0].error;
    }
    return new workflows_sdk_1.StepResponse(updated, transaction);
}, async (transaction, { container }) => {
    if (!transaction) {
        return;
    }
    await (0, update_promotion_rules_1.updatePromotionRulesWorkflow)(container).cancel({ transaction });
});
