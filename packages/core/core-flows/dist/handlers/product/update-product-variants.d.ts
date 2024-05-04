import { ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    productVariantsMap: Map<string, ProductTypes.UpdateProductVariantDTO[]>;
};
export declare function updateProductVariants({ container, data, }: WorkflowArguments<HandlerInput>): Promise<ProductTypes.UpdateProductVariantDTO[]>;
export declare namespace updateProductVariants {
    var aliases: {
        payload: string;
    };
}
export {};
