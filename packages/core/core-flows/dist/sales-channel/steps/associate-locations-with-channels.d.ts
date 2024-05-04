interface StepInput {
    links: {
        sales_channel_id: string;
        location_id: string;
    }[];
}
export declare const associateLocationsWithSalesChannelsStepId = "associate-locations-with-sales-channels-step";
export declare const associateLocationsWithSalesChannelsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, any>;
export {};
