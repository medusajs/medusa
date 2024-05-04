"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshCartShippingMethodsStep = exports.refreshCartShippingMethodsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.refreshCartShippingMethodsStepId = "refresh-cart-shipping-methods";
exports.refreshCartShippingMethodsStep = (0, workflows_sdk_1.createStep)(exports.refreshCartShippingMethodsStepId, async (data, { container }) => {
    const { cart } = data;
    const { shipping_methods: shippingMethods = [] } = cart;
    if (!shippingMethods?.length) {
        return new workflows_sdk_1.StepResponse(void 0, []);
    }
    const fulfillmentModule = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const cartModule = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const shippingOptionIds = shippingMethods.map((sm) => sm.shipping_option_id);
    const validShippingOptions = await fulfillmentModule.listShippingOptionsForContext({
        id: shippingOptionIds,
        context: { ...cart },
        address: {
            country_code: cart.shipping_address?.country_code,
            province_code: cart.shipping_address?.province,
            city: cart.shipping_address?.city,
            postal_expression: cart.shipping_address?.postal_code,
        },
    }, { relations: ["rules"] });
    const validShippingOptionIds = validShippingOptions.map((o) => o.id);
    const invalidShippingOptionIds = (0, utils_1.arrayDifference)(shippingOptionIds, validShippingOptionIds);
    const shippingMethodsToDelete = shippingMethods
        .filter((sm) => invalidShippingOptionIds.includes(sm.shipping_option_id))
        .map((sm) => sm.id);
    await cartModule.softDeleteShippingMethods(shippingMethodsToDelete);
    return new workflows_sdk_1.StepResponse(void 0, shippingMethodsToDelete);
}, async (shippingMethodsToRestore, { container }) => {
    if (shippingMethodsToRestore?.length) {
        const cartModule = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
        await cartModule.restoreShippingMethods(shippingMethodsToRestore);
    }
});
