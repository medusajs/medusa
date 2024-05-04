"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVariantPriceLinksStep = exports.validateVariantPriceLinksStepId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validateVariantPriceLinksStepId = "validate-variant-price-links";
exports.validateVariantPriceLinksStep = (0, workflows_sdk_1.createStep)(exports.validateVariantPriceLinksStepId, async (data, { container }) => {
    const remoteQuery = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    const variantIds = data
        .map((pl) => pl?.prices?.map((price) => price.variant_id) || [])
        .filter(Boolean)
        .flat(1);
    const variantPricingLinkQuery = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: "product_variant_price_set",
        fields: ["variant_id", "price_set_id"],
        variables: { variant_id: variantIds, take: null },
    });
    const links = await remoteQuery(variantPricingLinkQuery);
    const variantPriceSetMap = {};
    for (const link of links) {
        variantPriceSetMap[link.variant_id] = link.price_set_id;
    }
    const withoutLinks = variantIds.filter((id) => !variantPriceSetMap[id]);
    if (withoutLinks.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `No price set exist for variants: ${withoutLinks.join(", ")}`);
    }
    return new workflows_sdk_1.StepResponse(variantPriceSetMap);
});
