"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchPromotionRulesWorkflow = exports.batchPromotionRulesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_promotion_rules_workflow_1 = require("../steps/create-promotion-rules-workflow");
const update_promotion_rules_workflow_1 = require("../steps/update-promotion-rules-workflow");
const delete_promotion_rules_workflow_1 = require("../steps/delete-promotion-rules-workflow");
exports.batchPromotionRulesWorkflowId = "batch-promotion-rules";
exports.batchPromotionRulesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchPromotionRulesWorkflowId, (input) => {
    const createInput = (0, workflows_sdk_1.transform)({ input }, (data) => ({
        rule_type: data.input.rule_type,
        data: { id: data.input.id, rules: data.input.create ?? [] },
    }));
    const updateInput = (0, workflows_sdk_1.transform)({ input }, (data) => ({
        data: data.input.update ?? [],
    }));
    const deleteInput = (0, workflows_sdk_1.transform)({ input }, (data) => ({
        rule_type: data.input.rule_type,
        data: { id: data.input.id, rule_ids: data.input.delete ?? [] },
    }));
    const [created, updated, deleted] = (0, workflows_sdk_1.parallelize)((0, create_promotion_rules_workflow_1.createPromotionRulesWorkflowStep)(createInput), (0, update_promotion_rules_workflow_1.updatePromotionRulesWorkflowStep)(updateInput), (0, delete_promotion_rules_workflow_1.deletePromotionRulesWorkflowStep)(deleteInput));
    return (0, workflows_sdk_1.transform)({ created, updated, deleted }, (data) => data);
});
