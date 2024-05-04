"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentCollectionsStep = exports.createPaymentCollectionsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createPaymentCollectionsStepId = "create-payment-collections";
exports.createPaymentCollectionsStep = (0, workflows_sdk_1.createStep)(exports.createPaymentCollectionsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    const created = await service.createPaymentCollections(data);
    return new workflows_sdk_1.StepResponse(created, created.map((collection) => collection.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    await service.deletePaymentCollections(createdIds);
});
