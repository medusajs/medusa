import { ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type AssociationTaggedVariant = ProductTypes.ProductVariantDTO & {
    _associationTag?: string;
};
type ObjectWithVariant = {
    variants: ProductTypes.ProductVariantDTO[];
};
export declare function prepareCreateInventoryItems({ data, }: WorkflowArguments<{
    products: ObjectWithVariant[];
}>): Promise<{
    alias: string;
    value: {
        inventoryItems: AssociationTaggedVariant[];
    };
}>;
export declare namespace prepareCreateInventoryItems {
    var aliases: {
        products: string;
        output: string;
    };
}
export {};
