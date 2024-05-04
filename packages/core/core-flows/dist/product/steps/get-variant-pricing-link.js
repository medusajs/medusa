"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariantPricingLinkStep = exports.getVariantPricingLinkStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.getVariantPricingLinkStepId = "get-variant-pricing-link";
exports.getVariantPricingLinkStep = (0, workflows_sdk_1.createStep)(exports.getVariantPricingLinkStepId, async (data, { container }) => {
    if (!data.ids.length) {
        return new workflows_sdk_1.StepResponse([]);
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const linkService = remoteLink.getLinkModule(modules_sdk_1.Modules.PRODUCT, "variant_id", modules_sdk_1.Modules.PRICING, "price_set_id");
    const existingItems = await linkService.list({ variant_id: data.ids }, { select: ["variant_id", "price_set_id"] });
    if (existingItems.length !== data.ids.length) {
        const missing = (0, utils_1.arrayDifference)(data.ids, existingItems.map((i) => i.variant_id));
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Variants with IDs ${missing.join(", ")} do not have prices associated.`);
    }
    return new workflows_sdk_1.StepResponse(existingItems);
});
