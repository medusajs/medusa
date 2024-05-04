interface StepInput {
    links: {
        sales_channel_id: string;
        product_id: string;
    }[];
}
export declare const associateProductsWithSalesChannelsStepId = "associate-products-with-channels";
export declare const associateProductsWithSalesChannelsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, any>;
export {};
