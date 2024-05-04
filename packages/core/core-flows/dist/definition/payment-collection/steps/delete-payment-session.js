"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentSessionStep = exports.deletePaymentSessionStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deletePaymentSessionStepId = "delete-payment-session";
exports.deletePaymentSessionStep = (0, workflows_sdk_1.createStep)(exports.deletePaymentSessionStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    if (!input.payment_session_id) {
        return new workflows_sdk_1.StepResponse(void 0, null);
    }
    const [session] = await service.listPaymentSessions({
        id: input.payment_session_id,
    });
    await service.deletePaymentSession(input.payment_session_id);
    return new workflows_sdk_1.StepResponse(input.payment_session_id, session);
}, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PAYMENT);
    if (!input || !input.payment_collection) {
        return;
    }
    await service.createPaymentSession(input.payment_collection.id, {
        provider_id: input.provider_id,
        currency_code: input.currency_code,
        amount: input.amount,
        data: input.data ?? {},
        context: input.context,
    });
});
