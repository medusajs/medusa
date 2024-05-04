"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceListsStep = exports.createPriceListsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createPriceListsStepId = "create-price-lists";
exports.createPriceListsStep = (0, workflows_sdk_1.createStep)(exports.createPriceListsStepId, async (stepInput, { container }) => {
    const { data, variant_price_map: variantPriceMap } = stepInput;
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const createData = data.map((priceListDTO) => {
        const { prices = [], ...rest } = priceListDTO;
        const createPriceListData = { ...rest };
        createPriceListData.prices = prices.map((price) => ({
            currency_code: price.currency_code,
            amount: price.amount,
            min_quantity: price.min_quantity,
            max_quantity: price.max_quantity,
            price_set_id: variantPriceMap[price.variant_id],
            rules: price.rules,
        }));
        return createPriceListData;
    });
    const createdPriceLists = await pricingModule.createPriceLists(createData);
    return new workflows_sdk_1.StepResponse(createdPriceLists, createdPriceLists.map((createdPriceLists) => createdPriceLists.id));
}, async (createdPriceListIds, { container }) => {
    if (!createdPriceListIds?.length) {
        return;
    }
    const pricingModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    await pricingModule.deletePriceLists(createdPriceListIds);
});
