"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCartShippingOptionsStep = exports.validateCartShippingOptionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validateCartShippingOptionsStepId = "validate-cart-shipping-options";
exports.validateCartShippingOptionsStep = (0, workflows_sdk_1.createStep)(exports.validateCartShippingOptionsStepId, async (data, { container }) => {
    const { option_ids: optionIds = [], cart } = data;
    if (!optionIds.length) {
        return new workflows_sdk_1.StepResponse(void 0);
    }
    const fulfillmentModule = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const validShippingOptions = await fulfillmentModule.listShippingOptionsForContext({
        id: optionIds,
        context: { ...cart },
        address: {
            country_code: cart.shipping_address?.country_code,
            province_code: cart.shipping_address?.province,
            city: cart.shipping_address?.city,
            postal_expression: cart.shipping_address?.postal_code,
        },
    }, { relations: ["rules"] });
    const validShippingOptionIds = validShippingOptions.map((o) => o.id);
    const invalidOptionIds = (0, utils_1.arrayDifference)(optionIds, validShippingOptionIds);
    if (invalidOptionIds.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Shipping Options are invalid for cart.`);
    }
    return new workflows_sdk_1.StepResponse(void 0);
});
