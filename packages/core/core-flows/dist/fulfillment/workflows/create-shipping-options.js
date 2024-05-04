"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingOptionsWorkflow = exports.createShippingOptionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const set_shipping_options_price_sets_1 = require("../steps/set-shipping-options-price-sets");
const pricing_1 = require("../../pricing");
exports.createShippingOptionsWorkflowId = "create-shipping-options-workflow";
exports.createShippingOptionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createShippingOptionsWorkflowId, (input) => {
    const data = (0, workflows_sdk_1.transform)(input, (data) => {
        const shippingOptionsIndexToPrices = data.map((option, index) => {
            const prices = option.prices;
            return {
                shipping_option_index: index,
                prices,
            };
        });
        return {
            shippingOptions: data,
            shippingOptionsIndexToPrices,
        };
    });
    const createdShippingOptions = (0, steps_1.upsertShippingOptionsStep)(data.shippingOptions);
    const normalizedShippingOptionsPrices = (0, workflows_sdk_1.transform)({
        shippingOptions: createdShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
    }, (data) => {
        const ruleTypes = new Set();
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(({ shipping_option_index, prices }) => {
            prices.forEach((price) => {
                if ("region_id" in price) {
                    ruleTypes.add({
                        name: "region_id",
                        rule_attribute: "region_id",
                    });
                }
            });
            return {
                id: data.shippingOptions[shipping_option_index].id,
                prices,
            };
        });
        return {
            shippingOptionsPrices,
            ruleTypes: Array.from(ruleTypes),
        };
    });
    (0, pricing_1.createPricingRuleTypesStep)(normalizedShippingOptionsPrices.ruleTypes);
    const shippingOptionsPriceSetsLinkData = (0, steps_1.createShippingOptionsPriceSetsStep)(normalizedShippingOptionsPrices.shippingOptionsPrices);
    const normalizedLinkData = (0, workflows_sdk_1.transform)({
        shippingOptionsPriceSetsLinkData,
    }, (data) => {
        return data.shippingOptionsPriceSetsLinkData.map((item) => {
            return {
                id: item.id,
                price_sets: [item.priceSetId],
            };
        });
    });
    (0, set_shipping_options_price_sets_1.setShippingOptionsPriceSetsStep)(normalizedLinkData);
    return createdShippingOptions;
});
