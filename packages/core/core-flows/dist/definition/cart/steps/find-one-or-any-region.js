"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneOrAnyRegionStep = exports.findOneOrAnyRegionStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.findOneOrAnyRegionStepId = "find-one-or-any-region";
exports.findOneOrAnyRegionStep = (0, workflows_sdk_1.createStep)(exports.findOneOrAnyRegionStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.REGION);
    if (!data.regionId) {
        const regions = await service.list({});
        if (!regions?.length) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "No regions found");
        }
        return new workflows_sdk_1.StepResponse(regions[0]);
    }
    const region = await service.retrieve(data.regionId);
    return new workflows_sdk_1.StepResponse(region);
});
