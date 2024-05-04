"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalesChannelsWorkflow = exports.updateSalesChannelsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_sales_channels_1 = require("../steps/update-sales-channels");
exports.updateSalesChannelsWorkflowId = "update-sales-channels";
exports.updateSalesChannelsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateSalesChannelsWorkflowId, (input) => {
    return (0, update_sales_channels_1.updateSalesChannelsStep)(input);
});
