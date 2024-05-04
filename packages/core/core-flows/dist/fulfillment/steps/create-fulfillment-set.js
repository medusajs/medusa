"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFulfillmentSets = exports.createFulfillmentSetsId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createFulfillmentSetsId = "create-fulfillment-sets";
exports.createFulfillmentSets = (0, workflows_sdk_1.createStep)(exports.createFulfillmentSetsId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const createSets = await service.create(data);
    return new workflows_sdk_1.StepResponse(createSets, createSets.map((createdSet) => createdSet.id));
}, async (createSetIds, { container }) => {
    if (!createSetIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.delete(createSetIds);
});
