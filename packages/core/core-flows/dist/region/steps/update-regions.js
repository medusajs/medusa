"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegionsStep = exports.updateRegionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateRegionsStepId = "update-region";
exports.updateRegionsStep = (0, workflows_sdk_1.createStep)(exports.updateRegionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await service.list(data.selector, {
        select: selects,
        relations,
    });
    if (Object.keys(data.update).length === 0) {
        return new workflows_sdk_1.StepResponse(prevData, []);
    }
    const regions = await service.update(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(regions, prevData);
}, async (prevData, { container }) => {
    if (!prevData?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    await service.upsert(prevData.map((r) => ({
        id: r.id,
        name: r.name,
        currency_code: r.currency_code,
        metadata: r.metadata,
        countries: r.countries?.map((c) => c.iso_2),
    })));
});
