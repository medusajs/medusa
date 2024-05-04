import { BigNumberInput } from "@medusajs/types";
type StepInput = {
    payment_id: string;
    captured_by?: string;
    amount?: BigNumberInput;
};
export declare const capturePaymentStepId = "capture-payment-step";
export declare const capturePaymentStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").PaymentDTO>;
export {};
