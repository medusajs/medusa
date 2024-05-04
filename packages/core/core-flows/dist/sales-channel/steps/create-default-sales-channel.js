"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultSalesChannelStep = exports.createDefaultSalesChannelStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createDefaultSalesChannelStepId = "create-default-sales-channel";
exports.createDefaultSalesChannelStep = (0, workflows_sdk_1.createStep)(exports.createDefaultSalesChannelStepId, async (input, { container }) => {
    const salesChannelService = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    let shouldDelete = false;
    let [salesChannel] = await salesChannelService.list({}, { take: 1 });
    if (!salesChannel) {
        salesChannel = await salesChannelService.create(input.data);
        shouldDelete = true;
    }
    return new workflows_sdk_1.StepResponse(salesChannel, { id: salesChannel.id, shouldDelete });
}, async (data, { container }) => {
    if (!data?.id || !data.shouldDelete) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    await service.delete(data.id);
});
