"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceZonesStep = exports.deleteServiceZonesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteServiceZonesStepId = "delete-service-zones";
exports.deleteServiceZonesStep = (0, workflows_sdk_1.createStep)(exports.deleteServiceZonesStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.softDeleteServiceZones(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.restoreServiceZones(prevIds);
});
