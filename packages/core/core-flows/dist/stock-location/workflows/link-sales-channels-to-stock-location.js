"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkSalesChannelsToStockLocationWorkflow = exports.linkSalesChannelsToStockLocationWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
const sales_channel_1 = require("../../sales-channel");
exports.linkSalesChannelsToStockLocationWorkflowId = "link-sales-channels-to-stock-location";
exports.linkSalesChannelsToStockLocationWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.linkSalesChannelsToStockLocationWorkflowId, (input) => {
    const toAdd = (0, workflows_sdk_2.transform)({ input }, (data) => {
        return data.input.add?.map((salesChannelId) => ({
            sales_channel_id: salesChannelId,
            location_id: data.input.id,
        }));
    });
    const toRemove = (0, workflows_sdk_2.transform)({ input }, (data) => {
        return data.input.remove?.map((salesChannelId) => ({
            sales_channel_id: salesChannelId,
            location_id: data.input.id,
        }));
    });
    (0, sales_channel_1.associateLocationsWithSalesChannelsStep)({ links: toAdd });
    (0, sales_channel_1.detachLocationsFromSalesChannelsStep)({ links: toRemove });
});
