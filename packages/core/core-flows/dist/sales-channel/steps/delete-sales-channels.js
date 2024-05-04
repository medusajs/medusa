"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesChannelsStep = exports.deleteSalesChannelsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteSalesChannelsStepId = "delete-sales-channels";
exports.deleteSalesChannelsStep = (0, workflows_sdk_1.createStep)(exports.deleteSalesChannelsStepId, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    await service.softDelete(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (prevSalesChannelIds, { container }) => {
    if (!prevSalesChannelIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    await service.restore(prevSalesChannelIds);
});
