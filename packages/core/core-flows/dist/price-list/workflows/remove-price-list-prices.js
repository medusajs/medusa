"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePriceListPricesWorkflow = exports.removePriceListPricesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const remove_price_list_prices_1 = require("../steps/remove-price-list-prices");
exports.removePriceListPricesWorkflowId = "remove-price-list-prices";
exports.removePriceListPricesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.removePriceListPricesWorkflowId, (input) => {
    return (0, remove_price_list_prices_1.removePriceListPricesStep)(input.ids);
});
