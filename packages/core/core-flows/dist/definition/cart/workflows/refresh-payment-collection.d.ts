type WorklowInput = {
    cart_id: string;
};
interface StepInput {
    cart_id: string;
}
export declare const refreshPaymentCollectionForCartStepId = "refresh-payment-collection-for-cart";
export declare const refreshPaymentCollectionForCartStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, null>;
export declare const refreshPaymentCollectionForCartWorkflowId = "refresh-payment-collection-for-cart";
export declare const refreshPaymentCollectionForCartWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorklowInput, void, Record<string, Function>>;
export {};
