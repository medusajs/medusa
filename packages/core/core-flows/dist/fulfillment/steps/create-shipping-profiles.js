"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingProfilesStep = exports.createShippingProfilesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createShippingProfilesStepId = "create-shipping-profiles";
exports.createShippingProfilesStep = (0, workflows_sdk_1.createStep)(exports.createShippingProfilesStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const createdShippingProfiles = await service.createShippingProfiles(input);
    return new workflows_sdk_1.StepResponse(createdShippingProfiles, createdShippingProfiles.map((created) => created.id));
}, async (createdShippingProfiles, { container }) => {
    if (!createdShippingProfiles?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    await service.deleteShippingProfiles(createdShippingProfiles);
});
