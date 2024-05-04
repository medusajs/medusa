interface AddShippingMethodToCartWorkflowInput {
    cart_id: string;
    options: {
        id: string;
        data?: Record<string, unknown>;
    }[];
}
export declare const addShippingMethodToCartWorkflowId = "add-shipping-method-to-cart";
export declare const addShippingMethodToWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<AddShippingMethodToCartWorkflowInput, void, Record<string, Function>>;
export {};
