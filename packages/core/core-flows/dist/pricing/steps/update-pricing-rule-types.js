"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePricingRuleTypesStep = exports.updatePricingRuleTypesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updatePricingRuleTypesStepId = "update-pricing-rule-types";
exports.updatePricingRuleTypesStep = (0, workflows_sdk_1.createStep)(exports.updatePricingRuleTypesStepId, async (data, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(data);
    const dataBeforeUpdate = await pricingModule.listRuleTypes({ id: data.map((d) => d.id) }, { relations, select: selects });
    const updatedRuleTypes = await pricingModule.updateRuleTypes(data);
    return new workflows_sdk_1.StepResponse(updatedRuleTypes, {
        dataBeforeUpdate,
        selects,
        relations,
    });
}, async (revertInput, { container }) => {
    if (!revertInput) {
        return;
    }
    const { dataBeforeUpdate = [], selects, relations } = revertInput;
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.updateRuleTypes(dataBeforeUpdate.map((data) => (0, utils_1.convertItemResponseToUpdateRequest)(data, selects, relations)));
});
