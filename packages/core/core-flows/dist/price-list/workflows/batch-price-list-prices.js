"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchPriceListPricesWorkflow = exports.batchPriceListPricesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_price_list_prices_workflow_1 = require("../steps/create-price-list-prices-workflow");
const remove_price_list_prices_workflow_1 = require("../steps/remove-price-list-prices-workflow");
const update_price_list_prices_workflow_1 = require("../steps/update-price-list-prices-workflow");
exports.batchPriceListPricesWorkflowId = "batch-price-list-prices";
exports.batchPriceListPricesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.batchPriceListPricesWorkflowId, (input) => {
    const createInput = (0, workflows_sdk_1.transform)({ input: input.data }, (data) => [
        { id: data.input.id, prices: data.input.create },
    ]);
    const updateInput = (0, workflows_sdk_1.transform)({ input: input.data }, (data) => [
        { id: data.input.id, prices: data.input.update },
    ]);
    const [created, updated, deleted] = (0, workflows_sdk_1.parallelize)((0, create_price_list_prices_workflow_1.createPriceListPricesWorkflowStep)(createInput), (0, update_price_list_prices_workflow_1.updatePriceListPricesWorkflowStep)(updateInput), (0, remove_price_list_prices_workflow_1.removePriceListPricesWorkflowStep)(input.data.delete));
    return (0, workflows_sdk_1.transform)({ created, updated, deleted }, (data) => data);
});
