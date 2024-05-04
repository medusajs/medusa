import { ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
export declare function extractVariants({ data, }: WorkflowArguments<{
    object: {
        variants?: ProductTypes.ProductVariantDTO[];
    }[];
}>): Promise<{
    alias: string;
    value: {
        variants: ProductTypes.ProductVariantDTO[];
    };
}>;
export declare namespace extractVariants {
    var aliases: {
        output: string;
        object: string;
    };
}
