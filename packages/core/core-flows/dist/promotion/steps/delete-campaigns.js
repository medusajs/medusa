"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaignsStep = exports.deleteCampaignsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteCampaignsStepId = "delete-campaigns";
exports.deleteCampaignsStep = (0, workflows_sdk_1.createStep)(exports.deleteCampaignsStepId, async (ids, { container }) => {
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    await promotionModule.softDeleteCampaigns(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
        return;
    }
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    await promotionModule.restoreCampaigns(idsToRestore);
});
