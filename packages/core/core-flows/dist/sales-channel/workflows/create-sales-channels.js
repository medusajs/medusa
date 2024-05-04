"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSalesChannelsWorkflow = exports.createSalesChannelsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const create_sales_channels_1 = require("../steps/create-sales-channels");
exports.createSalesChannelsWorkflowId = "create-sales-channels";
exports.createSalesChannelsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createSalesChannelsWorkflowId, (input) => {
    return (0, create_sales_channels_1.createSalesChannelsStep)({ data: input.salesChannelsData });
});
