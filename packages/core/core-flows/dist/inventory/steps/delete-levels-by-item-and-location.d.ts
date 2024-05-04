import { DeleteEntityInput } from "@medusajs/modules-sdk";
export declare const deleteInventoryLevelsFromItemAndLocationsStepId = "delete-inventory-levels-from-item-and-location-step";
export declare const deleteInventoryLevelsFromItemAndLocationsStep: import("@medusajs/workflows-sdk").StepFunction<{
    inventory_item_id: string;
    location_id: string;
}[], DeleteEntityInput | undefined>;
