"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSessionsWorkflow = exports.createPaymentSessionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createPaymentSessionsWorkflowId = "create-payment-sessions";
exports.createPaymentSessionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createPaymentSessionsWorkflowId, (input) => {
    const paymentCollection = (0, steps_1.retrievePaymentCollectionStep)({
        id: input.payment_collection_id,
        config: {
            select: ["id", "amount", "currency_code"],
        },
    });
    const paymentSessionInput = (0, workflows_sdk_1.transform)({ paymentCollection, input }, (data) => {
        return {
            payment_collection_id: data.input.payment_collection_id,
            provider_id: data.input.provider_id,
            data: data.input.data,
            context: data.input.context,
            amount: data.paymentCollection.amount,
            currency_code: data.paymentCollection.currency_code,
        };
    });
    const created = (0, steps_1.createPaymentSessionStep)(paymentSessionInput);
    return created;
});
