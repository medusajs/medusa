"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertShippingOptionsStep = exports.upsertShippingOptionsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.upsertShippingOptionsStepId = "create-shipping-options-step";
exports.upsertShippingOptionsStep = (0, workflows_sdk_1.createStep)(exports.upsertShippingOptionsStepId, async (input, { container }) => {
    if (!input?.length) {
        return new workflows_sdk_1.StepResponse([], {});
    }
    const fulfillmentService = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const toUpdate = [];
    input.forEach((inputItem) => {
        if (!!inputItem.id) {
            return toUpdate.push(inputItem);
        }
        return;
    });
    let toUpdatePreviousData = [];
    if (toUpdate.length) {
        const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)(toUpdate);
        toUpdatePreviousData = await fulfillmentService.listShippingOptions({
            id: toUpdate.map((s) => s.id),
        }, {
            select: selects,
            relations,
        });
    }
    const upsertedShippingOptions = await fulfillmentService.upsertShippingOptions(input);
    const upsertedShippingOptionIds = upsertedShippingOptions.map((s) => s.id);
    const updatedIds = toUpdate.map((s) => s.id);
    return new workflows_sdk_1.StepResponse(upsertedShippingOptions, {
        updatedPreviousData: toUpdatePreviousData,
        createdIds: (0, utils_1.arrayDifference)(upsertedShippingOptionIds, updatedIds),
    });
}, async (shippingOptionIds, { container }) => {
    if (!shippingOptionIds?.updatedPreviousData?.length &&
        !shippingOptionIds?.createdIds?.length) {
        return;
    }
    const fulfillmentService = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    if (shippingOptionIds.updatedPreviousData.length) {
        await fulfillmentService.upsertShippingOptions(shippingOptionIds.updatedPreviousData);
    }
    if (shippingOptionIds.createdIds.length) {
        await fulfillmentService.deleteShippingOptions(shippingOptionIds.createdIds);
    }
});
