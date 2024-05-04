import { FilterablePaymentCollectionProps, PaymentCollectionUpdatableFields } from "@medusajs/types";
interface StepInput {
    selector: FilterablePaymentCollectionProps;
    update: PaymentCollectionUpdatableFields;
}
export declare const updatePaymentCollectionStepId = "update-payment-collection";
export declare const updatePaymentCollectionStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").PaymentCollectionDTO[]>;
export {};
