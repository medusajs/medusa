"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceZonesStep = exports.createServiceZonesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createServiceZonesStepId = "create-service-zones";
exports.createServiceZonesStep = (0, workflows_sdk_1.createStep)(exports.createServiceZonesStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const createdServiceZones = await service.createServiceZones(input);
    return new workflows_sdk_1.StepResponse(createdServiceZones, createdServiceZones.map((createdZone) => createdZone.id));
}, async (createdServiceZones, { container }) => {
    if (!createdServiceZones?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.deleteServiceZones(createdServiceZones);
});
