"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromotionsStep = exports.createPromotionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createPromotionsStepId = "create-promotions";
exports.createPromotionsStep = (0, workflows_sdk_1.createStep)(exports.createPromotionsStepId, async (data, { container }) => {
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const createdPromotions = await promotionModule.create(data);
    return new workflows_sdk_1.StepResponse(createdPromotions, createdPromotions.map((createdPromotions) => createdPromotions.id));
}, async (createdPromotionIds, { container }) => {
    if (!createdPromotionIds?.length) {
        return;
    }
    const promotionModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    await promotionModule.delete(createdPromotionIds);
});
