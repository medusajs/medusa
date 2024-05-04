"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartPromotionsWorkflow = exports.updateCartPromotionsWorkflowId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateCartPromotionsWorkflowId = "update-cart-promotions";
exports.updateCartPromotionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCartPromotionsWorkflowId, (input) => {
    const retrieveCartInput = {
        id: input.cartId,
        config: {
            relations: [
                "items",
                "items.adjustments",
                "shipping_methods",
                "shipping_methods.adjustments",
            ],
        },
    };
    (0, steps_1.updateCartPromotionsStep)({
        id: input.cartId,
        promo_codes: input.promoCodes,
        action: input.action || utils_1.PromotionActions.ADD,
    });
    const cart = (0, steps_1.retrieveCartStep)(retrieveCartInput);
    const actions = (0, steps_1.getActionsToComputeFromPromotionsStep)({
        cart,
    });
    const { lineItemAdjustmentsToCreate, lineItemAdjustmentIdsToRemove, shippingMethodAdjustmentsToCreate, shippingMethodAdjustmentIdsToRemove, } = (0, steps_1.prepareAdjustmentsFromPromotionActionsStep)({ actions });
    (0, workflows_sdk_1.parallelize)((0, steps_1.removeLineItemAdjustmentsStep)({ lineItemAdjustmentIdsToRemove }), (0, steps_1.removeShippingMethodAdjustmentsStep)({
        shippingMethodAdjustmentIdsToRemove,
    }));
    (0, workflows_sdk_1.parallelize)((0, steps_1.createLineItemAdjustmentsStep)({ lineItemAdjustmentsToCreate }), (0, steps_1.createShippingMethodAdjustmentsStep)({ shippingMethodAdjustmentsToCreate }));
});
