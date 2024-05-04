"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePriceListPricesWorkflowStep = exports.removePriceListPricesWorkflowStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const remove_price_list_prices_1 = require("../workflows/remove-price-list-prices");
exports.removePriceListPricesWorkflowStepId = "remove-price-list-prices-workflow";
exports.removePriceListPricesWorkflowStep = (0, workflows_sdk_1.createStep)(exports.removePriceListPricesWorkflowStepId, async (ids, { container }) => {
    const { transaction, result: updated } = await (0, remove_price_list_prices_1.removePriceListPricesWorkflow)(container).run({ input: { ids } });
    return new workflows_sdk_1.StepResponse(updated, transaction);
}, async (transaction, { container }) => {
    if (!transaction) {
        return;
    }
    await (0, remove_price_list_prices_1.removePriceListPricesWorkflow)(container).cancel({ transaction });
});
