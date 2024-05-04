"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePriceListsStep = exports.updatePriceListsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updatePriceListsStepId = "update-price-lists";
exports.updatePriceListsStep = (0, workflows_sdk_1.createStep)(exports.updatePriceListsStepId, async (data, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const { dataBeforeUpdate, selects, relations } = await getDataBeforeUpdate(pricingModule, data);
    const updatedPriceLists = await pricingModule.updatePriceLists(data);
    return new workflows_sdk_1.StepResponse(updatedPriceLists, {
        dataBeforeUpdate,
        selects,
        relations,
    });
}, async (revertInput, { container }) => {
    if (!revertInput) {
        return;
    }
    const { dataBeforeUpdate, selects, relations } = revertInput;
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.updatePriceLists(dataBeforeUpdate.map((data) => {
        const { price_list_rules: priceListRules = [], rules, ...rest } = data;
        const updateData = {
            ...rest,
            rules: (0, utils_1.buildPriceListRules)(priceListRules),
        };
        return (0, utils_1.convertItemResponseToUpdateRequest)(updateData, selects, relations);
    }));
});
// Since rules is an API level abstraction, we need to do this dance of data fetching
// to its actual attributes in the module to do perform a revert in case a rollback needs to happen.
// TODO: Check if there is a better way to approach this. Preferably the module should be handling this
// if this is not the response the module provides.
async function getDataBeforeUpdate(pricingModule, data) {
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(data, {
        objectFields: ["rules"],
    });
    const selectsClone = [...selects];
    const relationsClone = [...relations];
    if (selectsClone.includes("rules")) {
        const index = selectsClone.indexOf("rules", 0);
        if (index > -1) {
            selectsClone.splice(index, 1);
        }
        selectsClone.push("price_list_rules.price_list_rule_values.value", "price_list_rules.rule_type.rule_attribute");
        relationsClone.push("price_list_rules.price_list_rule_values", "price_list_rules.rule_type");
    }
    const dataBeforeUpdate = await pricingModule.listPriceLists({ id: data.map((d) => d.id) }, { relations: relationsClone, select: selectsClone });
    return {
        dataBeforeUpdate,
        selects,
        relations,
    };
}
