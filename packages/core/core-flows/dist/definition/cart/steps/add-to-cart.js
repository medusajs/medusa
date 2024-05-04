"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCartStep = exports.addToCartStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.addToCartStepId = "add-to-cart-step";
exports.addToCartStep = (0, workflows_sdk_1.createStep)(exports.addToCartStepId, async (data, { container }) => {
    const cartService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const items = await cartService.addLineItems(data.items);
    return new workflows_sdk_1.StepResponse(items, items);
}, async (createdLineItems, { container }) => {
    const cartService = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    if (!createdLineItems?.length) {
        return;
    }
    await cartService.deleteLineItems(createdLineItems.map((c) => c.id));
});
