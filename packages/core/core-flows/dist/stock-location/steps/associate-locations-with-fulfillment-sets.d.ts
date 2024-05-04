interface StepInput {
    input: {
        location_id: string;
        fulfillment_set_ids: string[];
    }[];
}
export declare const associateFulfillmentSetsWithLocationStepId = "associate-fulfillment-sets-with-location-step";
export declare const associateFulfillmentSetsWithLocationStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, any>;
export {};
