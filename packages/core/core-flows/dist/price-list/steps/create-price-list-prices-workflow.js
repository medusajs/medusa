"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPriceListPricesWorkflowStep = exports.createPriceListPricesWorkflowStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_price_list_prices_1 = require("../workflows/create-price-list-prices");
exports.createPriceListPricesWorkflowStepId = "create-price-list-prices-workflow-step";
exports.createPriceListPricesWorkflowStep = (0, workflows_sdk_1.createStep)(exports.createPriceListPricesWorkflowStepId, async (data, { container }) => {
    const { transaction, result: created } = await (0, create_price_list_prices_1.createPriceListPricesWorkflow)(container).run({ input: { data } });
    return new workflows_sdk_1.StepResponse(created, transaction);
}, async (transaction, { container }) => {
    if (!transaction) {
        return;
    }
    await (0, create_price_list_prices_1.createPriceListPricesWorkflow)(container).cancel({ transaction });
});
