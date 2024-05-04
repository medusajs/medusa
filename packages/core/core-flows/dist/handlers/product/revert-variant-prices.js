"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertVariantPrices = void 0;
const utils_1 = require("@medusajs/utils");
async function revertVariantPrices({ container, context, data, }) {
    const { createdLinks = [], originalMoneyAmounts = [], createdPriceSets = [], } = data;
    const featureFlagRouter = container.resolve("featureFlagRouter");
    const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(utils_1.MedusaV2Flag.key);
    if (!isPricingDomainEnabled) {
        return;
    }
    const pricingModuleService = container.resolve("pricingModuleService");
    const remoteLink = container.resolve("remoteLink");
    await remoteLink.remove(createdLinks);
    if (originalMoneyAmounts.length) {
        await pricingModuleService.updateMoneyAmounts(originalMoneyAmounts);
    }
    if (createdPriceSets.length) {
        await pricingModuleService.delete({
            id: createdPriceSets.map((cps) => cps.id),
        });
    }
}
exports.revertVariantPrices = revertVariantPrices;
revertVariantPrices.aliases = {
    productVariantsPrices: "productVariantsPrices",
};
