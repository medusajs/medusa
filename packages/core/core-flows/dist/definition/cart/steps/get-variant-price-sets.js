"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariantPriceSetsStep = exports.getVariantPriceSetsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.getVariantPriceSetsStepId = "get-variant-price-sets";
exports.getVariantPriceSetsStep = (0, workflows_sdk_1.createStep)(exports.getVariantPriceSetsStepId, async (data, { container }) => {
    if (!data.variantIds.length) {
        return new workflows_sdk_1.StepResponse({});
    }
    const pricingModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PRICING);
    const remoteQuery = container.resolve("remoteQuery");
    const variantPriceSets = await remoteQuery({
        variant: {
            fields: ["id"],
            price_set: {
                fields: ["id"],
            },
        },
    }, {
        variant: {
            id: data.variantIds,
        },
    });
    const notFound = [];
    const priceSetIds = [];
    variantPriceSets.forEach((v) => {
        if (v.price_set?.id) {
            priceSetIds.push(v.price_set.id);
        }
        else {
            notFound.push(v.id);
        }
    });
    if (notFound.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Variants with IDs ${notFound.join(", ")} do not have a price`);
    }
    const calculatedPriceSets = await pricingModuleService.calculatePrices({ id: priceSetIds }, { context: data.context });
    const idToPriceSet = new Map(calculatedPriceSets.map((p) => [p.id, p]));
    const variantToCalculatedPriceSets = variantPriceSets.reduce((acc, { id, price_set }) => {
        const calculatedPriceSet = idToPriceSet.get(price_set?.id);
        if (calculatedPriceSet) {
            acc[id] = calculatedPriceSet;
        }
        return acc;
    }, {});
    return new workflows_sdk_1.StepResponse(variantToCalculatedPriceSets);
});
