"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePaymentStep = exports.capturePaymentStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.capturePaymentStepId = "capture-payment-step";
exports.capturePaymentStep = (0, workflows_sdk_1.createStep)(exports.capturePaymentStepId, async (input, { container }) => {
    const paymentModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    const payment = await paymentModule.capturePayment(input);
    return new workflows_sdk_1.StepResponse(payment);
});
