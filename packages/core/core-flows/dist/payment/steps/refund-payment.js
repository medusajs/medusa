"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentStep = exports.refundPaymentStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.refundPaymentStepId = "refund-payment-step";
exports.refundPaymentStep = (0, workflows_sdk_1.createStep)(exports.refundPaymentStepId, async (input, { container }) => {
    const paymentModule = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    const payment = await paymentModule.refundPayment(input);
    return new workflows_sdk_1.StepResponse(payment);
});
