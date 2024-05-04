"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesChannelsWorkflow = exports.deleteSalesChannelsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const delete_sales_channels_1 = require("../steps/delete-sales-channels");
const remove_remote_links_1 = require("../../common/steps/remove-remote-links");
exports.deleteSalesChannelsWorkflowId = "delete-sales-channels";
exports.deleteSalesChannelsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteSalesChannelsWorkflowId, (input) => {
    (0, delete_sales_channels_1.deleteSalesChannelsStep)(input.ids);
    (0, remove_remote_links_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.SALES_CHANNEL]: { sales_channel_id: input.ids },
    });
});
