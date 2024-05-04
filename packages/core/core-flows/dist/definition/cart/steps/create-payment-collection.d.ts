import { BigNumberInput } from "@medusajs/types";
type StepInput = {
    region_id: string;
    currency_code: string;
    amount: BigNumberInput;
    metadata?: Record<string, unknown>;
};
export declare const createPaymentCollectionsStepId = "create-payment-collections";
export declare const createPaymentCollectionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput[], import("@medusajs/types").PaymentCollectionDTO[]>;
export {};
