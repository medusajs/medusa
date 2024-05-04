interface StepInput {
    items: {
        inventory_item_id: string;
        required_quantity: number;
        quantity: number;
        location_ids: string[];
    }[];
}
export declare const confirmInventoryStepId = "confirm-inventory-step";
export declare const confirmInventoryStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, null>;
export {};
