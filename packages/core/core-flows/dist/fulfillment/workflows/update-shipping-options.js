"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShippingOptionsWorkflow = exports.updateShippingOptionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const pricing_1 = require("../../pricing");
exports.updateShippingOptionsWorkflowId = "update-shipping-options-workflow";
exports.updateShippingOptionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateShippingOptionsWorkflowId, (input) => {
    const data = (0, workflows_sdk_1.transform)(input, (data) => {
        const shippingOptionsIndexToPrices = data.map((option, index) => {
            const prices = option.prices;
            delete option.prices;
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
    const updatedShippingOptions = (0, steps_1.upsertShippingOptionsStep)(data.shippingOptions);
    const normalizedShippingOptionsPrices = (0, workflows_sdk_1.transform)({
        shippingOptions: updatedShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
    }, (data) => {
        const ruleTypes = new Set();
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(({ shipping_option_index, prices }) => {
            prices?.forEach((price) => {
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
    (0, steps_1.setShippingOptionsPricesStep)(normalizedShippingOptionsPrices.shippingOptionsPrices);
    return updatedShippingOptions;
});
