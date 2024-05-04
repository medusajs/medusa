import { BigNumberInput } from "@medusajs/types";
type StepInput = {
    payment_id: string;
    created_by?: string;
    amount?: BigNumberInput;
};
export declare const refundPaymentStepId = "refund-payment-step";
export declare const refundPaymentStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").PaymentDTO>;
export {};
