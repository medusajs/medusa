"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentWorkflow = exports.refundPaymentWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const refund_payment_1 = require("../steps/refund-payment");
exports.refundPaymentWorkflowId = "refund-payment-workflow";
exports.refundPaymentWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.refundPaymentWorkflowId, (input) => {
    const payment = (0, refund_payment_1.refundPaymentStep)(input);
    return payment;
});
