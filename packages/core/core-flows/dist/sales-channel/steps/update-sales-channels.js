"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalesChannelsStep = exports.updateSalesChannelsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateSalesChannelsStepId = "update-sales-channels";
exports.updateSalesChannelsStep = (0, workflows_sdk_1.createStep)(exports.updateSalesChannelsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.list(data.selector, {
        select: selects,
        relations,
    });
    const channels = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(channels, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    await service.upsert(prevData.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        is_disabled: r.is_disabled,
        metadata: r.metadata,
    })));
});
