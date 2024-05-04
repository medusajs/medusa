"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSalesChannelsExistStep = exports.validateSalesChannelsExistStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validateSalesChannelsExistStepId = "validate-sales-channels-exist";
exports.validateSalesChannelsExistStep = (0, workflows_sdk_1.createStep)(exports.validateSalesChannelsExistStepId, async (data, { container }) => {
    const salesChannelModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.SALES_CHANNEL);
    const salesChannels = await salesChannelModuleService.list({ id: data.sales_channel_ids }, { select: ["id"] });
    const salesChannelIds = salesChannels.map((v) => v.id);
    const notFound = (0, utils_1.arrayDifference)(data.sales_channel_ids, salesChannelIds);
    if (notFound.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Sales channels with IDs ${notFound.join(", ")} do not exist`);
    }
    return new workflows_sdk_1.StepResponse(salesChannelIds);
});
