import { WorkflowArguments } from "@medusajs/workflows-sdk";
import { ProductVariantDTO } from "@medusajs/types";
export declare function useVariantsInventoryItems({ data, container, }: WorkflowArguments<{
    updateProductsExtractDeletedVariantsOutput: {
        variants: ProductVariantDTO[];
    };
}>): Promise<{
    alias: string;
    value: null;
} | {
    alias: string;
    value: {
        inventoryItems: {
            inventoryItem: import("@medusajs/types").InventoryItemDTO;
            tag: string;
        }[];
    };
}>;
export declare namespace useVariantsInventoryItems {
    var aliases: {
        variants: string;
        output: string;
    };
}
