export interface SetRegionsPaymentProvidersStepInput {
    input: {
        id: string;
        payment_providers?: string[];
    }[];
}
export declare const setRegionsPaymentProvidersStepId = "add-region-payment-providers-step";
export declare const setRegionsPaymentProvidersStep: import("@medusajs/workflows-sdk").StepFunction<SetRegionsPaymentProvidersStepInput, undefined>;
