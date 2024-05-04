import { ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
import { UpdateProductsPreparedData } from "../product";
export declare function updateProductsExtractCreatedVariants({ data, }: WorkflowArguments<{
    preparedData: UpdateProductsPreparedData;
    products: ProductTypes.ProductDTO[];
}>): Promise<{
    alias: string;
    value: {
        variants: ProductTypes.ProductVariantDTO[];
    }[];
}>;
export declare namespace updateProductsExtractCreatedVariants {
    var aliases: {
        preparedData: string;
        products: string;
        output: string;
    };
}
