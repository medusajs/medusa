"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceZonesStep = exports.updateServiceZonesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateServiceZonesStepId = "update-service-zones";
exports.updateServiceZonesStep = (0, workflows_sdk_1.createStep)(exports.updateServiceZonesStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        input.update,
    ]);
    const prevData = await service.listServiceZones(input.selector, {
        select: selects,
        relations,
    });
    const updatedServiceZones = await service.updateServiceZones(input.selector, input.update);
    return new workflows_sdk_1.StepResponse(updatedServiceZones, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.upsertServiceZones(prevData);
});
