"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrievePaymentCollectionStep = exports.retrievePaymentCollectionStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.retrievePaymentCollectionStepId = "retrieve-payment-collection";
exports.retrievePaymentCollectionStep = (0, workflows_sdk_1.createStep)(exports.retrievePaymentCollectionStepId, async (data, { container }) => {
    const paymentModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    const paymentCollection = await paymentModuleService.retrievePaymentCollection(data.id, data.config);
    return new workflows_sdk_1.StepResponse(paymentCollection);
});
