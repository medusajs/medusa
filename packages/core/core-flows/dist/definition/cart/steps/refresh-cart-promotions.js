"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshCartPromotionsStep = exports.refreshCartPromotionsStepId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const workflows_1 = require("../workflows");
exports.refreshCartPromotionsStepId = "refresh-cart-promotions";
exports.refreshCartPromotionsStep = (0, workflows_sdk_1.createStep)(exports.refreshCartPromotionsStepId, async (data, { container }) => {
    const { promo_codes = [], id, action = utils_1.PromotionActions.ADD } = data;
    await (0, workflows_1.updateCartPromotionsWorkflow)(container).run({
        input: {
            action,
            promoCodes: promo_codes,
            cartId: id,
        },
    });
    return new workflows_sdk_1.StepResponse(null);
});
