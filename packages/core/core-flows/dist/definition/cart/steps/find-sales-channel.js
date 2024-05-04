"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSalesChannelStep = exports.findSalesChannelStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.findSalesChannelStepId = "find-sales-channel";
exports.findSalesChannelStep = (0, workflows_sdk_1.createStep)(exports.findSalesChannelStepId, async (data, { container }) => {
    const salesChannelService = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    if (data.salesChannelId === null) {
        return new workflows_sdk_1.StepResponse(null);
    }
    let salesChannel;
    if (data.salesChannelId) {
        salesChannel = await salesChannelService.retrieve(data.salesChannelId);
    }
    else {
        // TODO: Find default sales channel from store
    }
    if (salesChannel?.is_disabled) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Unable to assign cart to disabled Sales Channel: ${salesChannel.name}`);
    }
    return new workflows_sdk_1.StepResponse(salesChannel);
});
