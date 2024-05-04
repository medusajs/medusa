"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkSalesChannelsToApiKeyWorkflow = exports.linkSalesChannelsToApiKeyWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.linkSalesChannelsToApiKeyWorkflowId = "link-sales-channels-to-api-key";
exports.linkSalesChannelsToApiKeyWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.linkSalesChannelsToApiKeyWorkflowId, (input) => {
    (0, steps_1.validateSalesChannelsExistStep)({
        sales_channel_ids: input.add ?? [],
    });
    (0, steps_1.linkSalesChannelsToApiKeyStep)(input);
});
