"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCartsStep = exports.createCartsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createCartsStepId = "create-carts";
exports.createCartsStep = (0, workflows_sdk_1.createStep)(exports.createCartsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const createdCarts = await service.create(data);
    return new workflows_sdk_1.StepResponse(createdCarts, createdCarts.map((cart) => cart.id));
}, async (createdCartsIds, { container }) => {
    if (!createdCartsIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    await service.delete(createdCartsIds);
});
