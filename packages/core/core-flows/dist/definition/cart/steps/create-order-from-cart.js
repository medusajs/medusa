"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromCartStep = exports.createOrderFromCartStepId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_orders_1 = require("../../../order/workflows/create-orders");
exports.createOrderFromCartStepId = "create-order-from-cart";
exports.createOrderFromCartStep = (0, workflows_sdk_1.createStep)(exports.createOrderFromCartStepId, async (input, { container }) => {
    const { cart } = input;
    const itemAdjustments = (cart.items || [])
        ?.map((item) => item.adjustments || [])
        .flat(1);
    const shippingAdjustments = (cart.shipping_methods || [])
        ?.map((sm) => sm.adjustments || [])
        .flat(1);
    const promoCodes = [...itemAdjustments, ...shippingAdjustments]
        .map((adjustment) => adjustment.code)
        .filter((code) => Boolean);
    const { transaction, result } = await (0, create_orders_1.createOrdersWorkflow)(container).run({
        input: {
            region_id: cart.region?.id,
            customer_id: cart.customer?.id,
            sales_channel_id: cart.sales_channel_id,
            status: utils_1.OrderStatus.PENDING,
            email: cart.email,
            currency_code: cart.currency_code,
            shipping_address: cart.shipping_address,
            billing_address: cart.billing_address,
            // TODO: This should be handle correctly
            no_notification: false,
            items: cart.items,
            shipping_methods: cart.shipping_methods,
            metadata: cart.metadata,
            promo_codes: promoCodes,
        },
    });
    return new workflows_sdk_1.StepResponse(result, { transaction });
}, async (flow, { container }) => {
    if (!flow) {
        return;
    }
    await (0, create_orders_1.createOrdersWorkflow)(container).cancel({
        transaction: flow.transaction,
    });
});
