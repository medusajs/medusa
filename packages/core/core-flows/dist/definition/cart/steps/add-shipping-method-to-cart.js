"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShippingMethodToCartStep = exports.addShippingMethodToCartStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.addShippingMethodToCartStepId = "add-shipping-method-to-cart-step";
exports.addShippingMethodToCartStep = (0, workflows_sdk_1.createStep)(exports.addShippingMethodToCartStepId, async (data, { container }) => {
    const cartService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const methods = await cartService.addShippingMethods(data.shipping_methods);
    return new workflows_sdk_1.StepResponse(methods, methods);
}, async (methods, { container }) => {
    const cartService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    if (!methods?.length) {
        return;
    }
    await cartService.deleteShippingMethods(methods.map((m) => m.id));
});
