"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartsStep = exports.updateCartsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateCartsStepId = "update-carts";
exports.updateCartsStep = (0, workflows_sdk_1.createStep)(exports.updateCartsStepId, async (data, { container }) => {
    const cartModule = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(data);
    const cartsBeforeUpdate = await cartModule.list({ id: data.map((d) => d.id) }, { select: selects, relations });
    const updatedCart = await cartModule.update(data);
    return new workflows_sdk_1.StepResponse(updatedCart, cartsBeforeUpdate);
}, async (cartsBeforeUpdate, { container }) => {
    if (!cartsBeforeUpdate) {
        return;
    }
    const cartModule = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const dataToUpdate = [];
    for (const cart of cartsBeforeUpdate) {
        dataToUpdate.push({
            id: cart.id,
            region_id: cart.region_id,
            customer_id: cart.customer_id,
            sales_channel_id: cart.sales_channel_id,
            email: cart.email,
            currency_code: cart.currency_code,
            metadata: cart.metadata,
        });
    }
    return await cartModule.update(dataToUpdate);
});
