import { ProductTypes, WorkflowTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ProductHandle = string;
type VariantIndexAndPrices = {
    index: number;
    prices: WorkflowTypes.ProductWorkflow.CreateProductVariantPricesInputDTO[];
};
type HandlerInput = {
    productsHandleVariantsIndexPricesMap: Map<ProductHandle, VariantIndexAndPrices[]>;
    products: ProductTypes.ProductDTO[];
};
export declare function updateProductsVariantsPrices({ container, context, data, }: WorkflowArguments<HandlerInput>): Promise<void>;
export declare namespace updateProductsVariantsPrices {
    var aliases: {
        products: string;
    };
}
export {};
