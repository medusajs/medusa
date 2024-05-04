"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveCartStep = exports.retrieveCartStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.retrieveCartStepId = "retrieve-cart";
exports.retrieveCartStep = (0, workflows_sdk_1.createStep)(exports.retrieveCartStepId, async (data, { container }) => {
    const cartModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const cart = await cartModuleService.retrieve(data.id, data.config);
    // TODO: remove this when cart handles totals calculation
    cart.items = cart.items?.map((item) => {
        item.subtotal = item.unit_price;
        return item;
    });
    // TODO: remove this when cart handles totals calculation
    cart.shipping_methods = cart.shipping_methods?.map((shipping_method) => {
        // TODO: should we align all amounts/prices fields to be unit_price?
        shipping_method.subtotal = shipping_method.amount;
        return shipping_method;
    });
    return new workflows_sdk_1.StepResponse(cart);
});
