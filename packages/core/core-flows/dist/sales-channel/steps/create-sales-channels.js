"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSalesChannelsStep = exports.createSalesChannelsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createSalesChannelsStepId = "create-sales-channels";
exports.createSalesChannelsStep = (0, workflows_sdk_1.createStep)(exports.createSalesChannelsStepId, async (input, { container }) => {
    const salesChannelService = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    const salesChannels = await salesChannelService.create(input.data);
    return new workflows_sdk_1.StepResponse(salesChannels, salesChannels.map((s) => s.id));
}, async (createdIds, { container }) => {
    if (!createdIds) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    await service.delete(createdIds);
});
