interface StepInput {
    links: {
        sales_channel_id: string;
        location_id: string;
    }[];
}
export declare const detachLocationsFromSalesChannelsStepId = "detach-locations-from-sales-channels";
export declare const detachLocationsFromSalesChannelsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, never[] | undefined>;
export {};
