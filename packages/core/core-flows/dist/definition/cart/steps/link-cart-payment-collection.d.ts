type StepInput = {
    links: {
        cart_id: string;
        payment_collection_id: string;
    }[];
};
export declare const linkCartAndPaymentCollectionsStepId = "link-cart-payment-collection";
export declare const linkCartAndPaymentCollectionsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
