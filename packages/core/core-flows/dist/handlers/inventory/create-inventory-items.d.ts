import { InventoryItemDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type Result = {
    tag: string;
    inventoryItem: InventoryItemDTO;
}[];
export declare function createInventoryItems({ container, data, }: WorkflowArguments<{
    inventoryItems: (InventoryItemDTO & {
        _associationTag?: string;
    })[];
}>): Promise<Result | void>;
export declare namespace createInventoryItems {
    var aliases: {
        payload: string;
    };
}
export {};
