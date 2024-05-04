"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionsToComputeFromPromotionsStep = exports.getActionsToComputeFromPromotionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.getActionsToComputeFromPromotionsStepId = "get-actions-to-compute-from-promotions";
exports.getActionsToComputeFromPromotionsStep = (0, workflows_sdk_1.createStep)(exports.getActionsToComputeFromPromotionsStepId, async (data, { container }) => {
    const { cart } = data;
    const remoteQuery = container.resolve(modules_sdk_1.LinkModuleUtils.REMOTE_QUERY);
    const promotionService = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const existingCartPromotionLinks = await remoteQuery({
        cart_promotion: {
            __args: { cart_id: [cart.id] },
            fields: ["id", "cart_id", "promotion_id", "deleted_at"],
        },
    });
    const existingPromotions = await promotionService.list({ id: existingCartPromotionLinks.map((l) => l.promotion_id) }, { take: null, select: ["code"] });
    const actionsToCompute = await promotionService.computeActions(existingPromotions.map((p) => p.code), cart);
    return new workflows_sdk_1.StepResponse(actionsToCompute);
});
