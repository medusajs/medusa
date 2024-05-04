import { ProductDTO, ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    products: ProductTypes.UpdateProductDTO[];
};
export declare function updateProducts({ container, context, data, }: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]>;
export declare namespace updateProducts {
    var aliases: {
        products: string;
    };
}
export {};
