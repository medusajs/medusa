interface StepInput {
    payment_session_id?: string;
}
export declare const deletePaymentSessionStepId = "delete-payment-session";
export declare const deletePaymentSessionStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, string | undefined>;
export {};
