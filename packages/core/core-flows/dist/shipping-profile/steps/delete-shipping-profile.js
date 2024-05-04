"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShippingProfilesStep = exports.deleteShippingProfilesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteShippingProfilesStepId = "delete-shipping-profile";
exports.deleteShippingProfilesStep = (0, workflows_sdk_1.createStep)(exports.deleteShippingProfilesStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.softDeleteShippingProfiles(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevIds, { container }) => {
    if (!prevIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.restoreShippingProfiles(prevIds);
});
