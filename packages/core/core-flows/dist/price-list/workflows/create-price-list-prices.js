"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceListPricesWorkflow = exports.createPriceListPricesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_price_list_prices_1 = require("../steps/create-price-list-prices");
const validate_price_lists_1 = require("../steps/validate-price-lists");
const validate_variant_price_links_1 = require("../steps/validate-variant-price-links");
exports.createPriceListPricesWorkflowId = "create-price-list-prices";
exports.createPriceListPricesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createPriceListPricesWorkflowId, (input) => {
    const [_, variantPriceMap] = (0, workflows_sdk_1.parallelize)((0, validate_price_lists_1.validatePriceListsStep)(input.data), (0, validate_variant_price_links_1.validateVariantPriceLinksStep)(input.data));
    return (0, create_price_list_prices_1.createPriceListPricesStep)({
        data: input.data,
        variant_price_map: variantPriceMap,
    });
});
