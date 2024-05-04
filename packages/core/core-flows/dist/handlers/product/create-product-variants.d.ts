import { BigNumberInput, ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type VariantPrice = {
    region_id?: string;
    currency_code?: string;
    amount: BigNumberInput;
    min_quantity?: BigNumberInput;
    max_quantity?: BigNumberInput;
};
type HandlerInput = {
    productVariantsMap: Map<string, ProductTypes.CreateProductVariantDTO[]>;
    variantIndexPricesMap: Map<number, VariantPrice[]>;
};
export declare function createProductVariants({ container, data, }: WorkflowArguments<HandlerInput>): Promise<{
    productVariants: ProductTypes.ProductVariantDTO[];
    variantPricesMap: Map<string, VariantPrice[]>;
}>;
export declare namespace createProductVariants {
    var aliases: {
        payload: string;
    };
}
export {};
