import { BigNumberInput, PaymentProviderContext } from "@medusajs/types";
interface StepInput {
    payment_collection_id: string;
    provider_id: string;
    amount: BigNumberInput;
    currency_code: string;
    context?: PaymentProviderContext;
    data?: Record<string, unknown>;
}
export declare const createPaymentSessionStepId = "create-payment-session";
export declare const createPaymentSessionStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").PaymentSessionDTO>;
export {};
