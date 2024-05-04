import { InventoryItemDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
export declare function detachInventoryItems({ container, context, data, }: WorkflowArguments<{
    inventoryItems: {
        tag: string;
        inventoryItem: InventoryItemDTO;
    }[];
}>): Promise<{
    tag: string;
    inventoryItem: InventoryItemDTO;
}[]>;
export declare namespace detachInventoryItems {
    var aliases: {
        inventoryItems: string;
    };
}
