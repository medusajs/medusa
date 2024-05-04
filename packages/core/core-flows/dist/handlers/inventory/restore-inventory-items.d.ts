import { InventoryItemDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
export declare function restoreInventoryItems({ container, context, data, }: WorkflowArguments<{
    inventoryItems: {
        inventoryItem: InventoryItemDTO;
    }[];
}>): Promise<void>;
export declare namespace restoreInventoryItems {
    var aliases: {
        inventoryItems: string;
    };
}
