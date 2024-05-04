"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePriceListsStep = exports.validatePriceListsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validatePriceListsStepId = "validate-price-lists";
exports.validatePriceListsStep = (0, workflows_sdk_1.createStep)(exports.validatePriceListsStepId, async (data, { container }) => {
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const priceListIds = data.map((d) => d.id);
    const priceLists = await pricingModule.listPriceLists({ id: priceListIds });
    const diff = (0, utils_1.arrayDifference)(priceListIds, priceLists.map((pl) => pl.id));
    if (diff.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Price lists with id: ${diff.join(", ")} was not found`);
    }
    const priceListMap = {};
    for (const priceList of priceLists) {
        priceListMap[priceList.id] = priceList;
    }
    return new workflows_sdk_1.StepResponse(priceListMap);
});
