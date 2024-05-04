"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignsStep = exports.createCampaignsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createCampaignsStepId = "create-campaigns";
exports.createCampaignsStep = (0, workflows_sdk_1.createStep)(exports.createCampaignsStepId, async (data, { container }) => {
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const createdCampaigns = await promotionModule.createCampaigns(data);
    return new workflows_sdk_1.StepResponse(createdCampaigns, createdCampaigns.map((createdCampaigns) => createdCampaigns.id));
}, async (createdCampaignIds, { container }) => {
    if (!createdCampaignIds?.length) {
        return;
    }
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    await promotionModule.delete(createdCampaignIds);
});
