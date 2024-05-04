import { InventoryItemDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
export declare function removeInventoryItems({ container, data, }: WorkflowArguments<{
    inventoryItems: {
        inventoryItem: InventoryItemDTO;
    }[];
}>): Promise<{
    inventoryItem: InventoryItemDTO;
}[]>;
export declare namespace removeInventoryItems {
    var aliases: {
        inventoryItems: string;
    };
}
