"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartPromotionsStep = exports.updateCartPromotionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateCartPromotionsStepId = "update-cart-promotions";
exports.updateCartPromotionsStep = (0, workflows_sdk_1.createStep)(exports.updateCartPromotionsStepId, async (data, { container }) => {
    const { promo_codes = [], id, action = utils_1.PromotionActions.ADD } = data;
    const remoteLink = container.resolve(modules_sdk_1.LinkModuleUtils.REMOTE_LINK);
    const remoteQuery = container.resolve(modules_sdk_1.LinkModuleUtils.REMOTE_QUERY);
    const promotionService = container.resolve(modules_sdk_1.ModuleRegistrationName.PROMOTION);
    const existingCartPromotionLinks = await remoteQuery({
        cart_promotion: {
            __args: { cart_id: [id] },
            fields: ["cart_id", "promotion_id"],
        },
    });
    const promotionLinkMap = new Map(existingCartPromotionLinks.map((link) => [link.promotion_id, link]));
    const promotions = await promotionService.list({ code: promo_codes }, { select: ["id"] });
    const linksToCreate = [];
    const linksToDismiss = [];
    for (const promotion of promotions) {
        const linkObject = {
            [modules_sdk_1.Modules.CART]: { cart_id: id },
            [modules_sdk_1.Modules.PROMOTION]: { promotion_id: promotion.id },
        };
        if ([utils_1.PromotionActions.ADD, utils_1.PromotionActions.REPLACE].includes(action)) {
            linksToCreate.push(linkObject);
        }
        if (action === utils_1.PromotionActions.REMOVE) {
            const link = promotionLinkMap.get(promotion.id);
            if (link) {
                linksToDismiss.push(linkObject);
            }
        }
    }
    if (action === utils_1.PromotionActions.REPLACE) {
        for (const link of existingCartPromotionLinks) {
            linksToDismiss.push({
                [modules_sdk_1.Modules.CART]: { cart_id: link.cart_id },
                [modules_sdk_1.Modules.PROMOTION]: { promotion_id: link.promotion_id },
            });
        }
    }
    const linksToDismissPromise = linksToDismiss.length
        ? remoteLink.dismiss(linksToDismiss)
        : [];
    const linksToCreatePromise = linksToCreate.length
        ? remoteLink.create(linksToCreate)
        : [];
    const [_, createdLinks] = await Promise.all([
        linksToDismissPromise,
        linksToCreatePromise,
    ]);
    return new workflows_sdk_1.StepResponse(null, {
        createdLinkIds: createdLinks.map((link) => link.id),
        dismissedLinks: linksToDismiss,
    });
}, async (revertData, { container }) => {
    const remoteLink = container.resolve(modules_sdk_1.LinkModuleUtils.REMOTE_LINK);
    if (revertData?.dismissedLinks?.length) {
        await remoteLink.create(revertData.dismissedLinks);
    }
    if (revertData?.createdLinkIds?.length) {
        await remoteLink.delete(revertData.createdLinkIds);
    }
});
