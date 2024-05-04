"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePaymentWorkflow = exports.capturePaymentWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const capture_payment_1 = require("../steps/capture-payment");
exports.capturePaymentWorkflowId = "capture-payment-workflow";
exports.capturePaymentWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.capturePaymentWorkflowId, (input) => {
    const payment = (0, capture_payment_1.capturePaymentStep)(input);
    return payment;
});
