"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentCollectionStep = exports.updatePaymentCollectionStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updatePaymentCollectionStepId = "update-payment-collection";
exports.updatePaymentCollectionStep = (0, workflows_sdk_1.createStep)(exports.updatePaymentCollectionStepId, async (data, { container }) => {
    const paymentModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        data.update,
    ]);
    const prevData = await paymentModuleService.listPaymentCollections(data.selector, {
        select: selects,
        relations,
    });
    const updated = await paymentModuleService.updatePaymentCollections(data.selector, data.update);
    return new workflows_sdk_1.StepResponse(updated, prevData);
}, async (prevData, { container }) => {
    if (!prevData) {
        return;
    }
    const paymentModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    await paymentModuleService.upsertPaymentCollections(prevData.map((pc) => ({
        id: pc.id,
        amount: pc.amount,
        currency_code: pc.currency_code,
        metadata: pc.metadata,
    })));
});
