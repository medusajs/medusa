"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareAdjustmentsFromPromotionActionsStep = exports.prepareAdjustmentsFromPromotionActionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.prepareAdjustmentsFromPromotionActionsStepId = "prepare-adjustments-from-promotion-actions";
exports.prepareAdjustmentsFromPromotionActionsStep = (0, workflows_sdk_1.createStep)(exports.prepareAdjustmentsFromPromotionActionsStepId, async (data, { container }) => {
    const promotionModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const { actions = [] } = data;
    const promotions = await promotionModuleService.list({ code: actions.map((a) => a.code) }, { select: ["id", "code"] });
    const promotionsMap = new Map(promotions.map((promotion) => [promotion.code, promotion]));
    const lineItemAdjustmentsToCreate = actions
        .filter((a) => a.action === utils_1.ComputedActions.ADD_ITEM_ADJUSTMENT)
        .map((action) => ({
        code: action.code,
        amount: action.amount,
        item_id: action.item_id,
        promotion_id: promotionsMap.get(action.code)?.id,
    }));
    const lineItemAdjustmentIdsToRemove = actions
        .filter((a) => a.action === utils_1.ComputedActions.REMOVE_ITEM_ADJUSTMENT)
        .map((a) => a.adjustment_id);
    const shippingMethodAdjustmentsToCreate = actions
        .filter((a) => a.action === utils_1.ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT)
        .map((action) => ({
        code: action.code,
        amount: action.amount,
        shipping_method_id: action
            .shipping_method_id,
        promotion_id: promotionsMap.get(action.code)?.id,
    }));
    const shippingMethodAdjustmentIdsToRemove = actions
        .filter((a) => a.action === utils_1.ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT)
        .map((a) => a.adjustment_id);
    return new workflows_sdk_1.StepResponse({
        lineItemAdjustmentsToCreate,
        lineItemAdjustmentIdsToRemove,
        shippingMethodAdjustmentsToCreate,
        shippingMethodAdjustmentIdsToRemove,
    });
});
