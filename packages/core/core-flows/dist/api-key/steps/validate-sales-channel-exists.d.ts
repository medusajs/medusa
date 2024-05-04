interface StepInput {
    sales_channel_ids: string[];
}
export declare const validateSalesChannelsExistStepId = "validate-sales-channels-exist";
export declare const validateSalesChannelsExistStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, string[]>;
export {};
