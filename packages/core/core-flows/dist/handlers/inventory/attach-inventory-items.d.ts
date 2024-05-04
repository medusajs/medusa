import { InventoryItemDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
export declare function attachInventoryItems({ container, context, data, }: WorkflowArguments<{
    inventoryItems: {
        tag: string;
        inventoryItem: InventoryItemDTO;
    }[];
}>): Promise<{
    tag: string;
    inventoryItem: InventoryItemDTO;
}[]>;
export declare namespace attachInventoryItems {
    var aliases: {
        inventoryItems: string;
    };
}
