import { FindConfig, PaymentCollectionDTO } from "@medusajs/types";
interface StepInput {
    id: string;
    config?: FindConfig<PaymentCollectionDTO>;
}
export declare const retrievePaymentCollectionStepId = "retrieve-payment-collection";
export declare const retrievePaymentCollectionStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, PaymentCollectionDTO>;
export {};
