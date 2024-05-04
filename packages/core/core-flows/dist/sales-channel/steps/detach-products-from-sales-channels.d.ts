interface StepInput {
    links: {
        sales_channel_id: string;
        product_id: string;
    }[];
}
export declare const detachProductsFromSalesChannelsStepId = "detach-products-from-sales-channels-step";
export declare const detachProductsFromSalesChannelsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, undefined>;
export {};
