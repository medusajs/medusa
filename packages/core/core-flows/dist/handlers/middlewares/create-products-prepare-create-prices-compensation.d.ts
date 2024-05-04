import { ProductTypes, WorkflowTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ProductHandle = string;
type VariantIndexAndPrices = {
    index: number;
    prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[];
};
export declare function createProductsPrepareCreatePricesCompensation({ data, }: WorkflowArguments<{
    preparedData: {
        productsHandleVariantsIndexPricesMap: Map<ProductHandle, VariantIndexAndPrices[]>;
    };
    products: ProductTypes.ProductDTO[];
}>): Promise<{
    alias: string;
    value: {
        productsHandleVariantsIndexPricesMap: Map<any, any>;
        products: ProductTypes.ProductDTO[];
    };
}>;
export declare namespace createProductsPrepareCreatePricesCompensation {
    var aliases: {
        preparedData: string;
        output: string;
    };
}
export {};
