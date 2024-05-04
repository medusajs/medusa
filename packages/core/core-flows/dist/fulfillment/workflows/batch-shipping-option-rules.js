"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchShippingOptionRulesWorkflow = exports.batchShippingOptionRulesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const update_shipping_option_rules_1 = require("../steps/update-shipping-option-rules");
exports.batchShippingOptionRulesWorkflowId = "batch-shipping-option-rules";
exports.batchShippingOptionRulesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchShippingOptionRulesWorkflowId, (input) => {
    const actionInputs = (0, workflows_sdk_1.transform)({ input }, (data) => {
        const { create, update, delete: del } = data.input;
        return {
            createInput: { data: create ?? [] },
            updateInput: { data: update ?? [] },
            deleteInput: { ids: del ?? [] },
        };
    });
    const [created, updated, deleted] = (0, workflows_sdk_1.parallelize)((0, steps_1.createShippingOptionRulesStep)(actionInputs.createInput), (0, update_shipping_option_rules_1.updateShippingOptionRulesStep)(actionInputs.updateInput), (0, steps_1.deleteShippingOptionRulesStep)(actionInputs.deleteInput));
    return (0, workflows_sdk_1.transform)({ created, deleted, updated }, (data) => data);
});
