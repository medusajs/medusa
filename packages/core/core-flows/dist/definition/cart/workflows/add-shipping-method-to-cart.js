"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShippingMethodToWorkflow = exports.addShippingMethodToCartWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const use_remote_query_1 = require("../../../common/steps/use-remote-query");
const steps_1 = require("../steps");
const refresh_cart_promotions_1 = require("../steps/refresh-cart-promotions");
const update_tax_lines_1 = require("../steps/update-tax-lines");
const fields_1 = require("../utils/fields");
exports.addShippingMethodToCartWorkflowId = "add-shipping-method-to-cart";
exports.addShippingMethodToWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.addShippingMethodToCartWorkflowId, (input) => {
    const cart = (0, use_remote_query_1.useRemoteQueryStep)({
        entry_point: "cart",
        fields: fields_1.cartFieldsForRefreshSteps,
        variables: { id: input.cart_id },
        list: false,
    });
    const optionIds = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return (data.input.options ?? []).map((i) => i.id);
    });
    (0, steps_1.validateCartShippingOptionsStep)({
        option_ids: optionIds,
        cart,
    });
    const shippingOptions = (0, use_remote_query_1.useRemoteQueryStep)({
        entry_point: "shipping_option",
        fields: ["id", "name", "calculated_price.calculated_amount"],
        variables: {
            id: optionIds,
            calculated_price: {
                context: { currency_code: cart.currency_code },
            },
        },
    }).config({ name: "fetch-shipping-option" });
    const shippingMethodInput = (0, workflows_sdk_1.transform)({ input, shippingOptions }, (data) => {
        const options = (data.input.options ?? []).map((option) => {
            const shippingOption = data.shippingOptions.find((so) => so.id === option.id);
            return {
                shipping_option_id: shippingOption.id,
                amount: shippingOption.calculated_price.calculated_amount,
                data: option.data ?? {},
                name: shippingOption.name,
                cart_id: data.input.cart_id,
            };
        });
        return options;
    });
    const shippingMethods = (0, steps_1.addShippingMethodToCartStep)({
        shipping_methods: shippingMethodInput,
    });
    (0, refresh_cart_promotions_1.refreshCartPromotionsStep)({ id: input.cart_id });
    (0, update_tax_lines_1.updateTaxLinesStep)({
        cart_or_cart_id: input.cart_id,
        shipping_methods: shippingMethods,
    });
});
