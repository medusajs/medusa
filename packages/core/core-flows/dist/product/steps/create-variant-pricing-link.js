"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVariantPricingLinkStep = exports.createVariantPricingLinkStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createVariantPricingLinkStepId = "create-variant-pricing-link";
exports.createVariantPricingLinkStep = (0, workflows_sdk_1.createStep)(exports.createVariantPricingLinkStepId, async (data, { container }) => {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await remoteLink.create(data.links.map((entry) => ({
        [modules_sdk_1.Modules.PRODUCT]: {
            variant_id: entry.variant_id,
        },
        [modules_sdk_1.Modules.PRICING]: {
            price_set_id: entry.price_set_id,
        },
    })));
    return new workflows_sdk_1.StepResponse(void 0, data);
}, async (data, { container }) => {
    if (!data?.links?.length) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const links = data.links.map((entry) => ({
        [modules_sdk_1.Modules.PRODUCT]: {
            variant_id: entry.variant_id,
        },
        [modules_sdk_1.Modules.PRICING]: {
            price_set_id: entry.price_set_id,
        },
    }));
    await remoteLink.dismiss(links);
});
