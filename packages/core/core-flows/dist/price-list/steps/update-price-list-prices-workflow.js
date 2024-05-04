"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePriceListPricesWorkflowStep = exports.updatePriceListPricesWorkflowStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_price_list_prices_1 = require("../workflows/update-price-list-prices");
exports.updatePriceListPricesWorkflowStepId = "update-price-list-prices-workflow";
exports.updatePriceListPricesWorkflowStep = (0, workflows_sdk_1.createStep)(exports.updatePriceListPricesWorkflowStepId, async (data, { container }) => {
    const { transaction, result: updated } = await (0, update_price_list_prices_1.updatePriceListPricesWorkflow)(container).run({ input: { data } });
    return new workflows_sdk_1.StepResponse(updated, transaction);
}, async (transaction, { container }) => {
    if (!transaction) {
        return;
    }
    await (0, update_price_list_prices_1.updatePriceListPricesWorkflow)(container).cancel({ transaction });
});
