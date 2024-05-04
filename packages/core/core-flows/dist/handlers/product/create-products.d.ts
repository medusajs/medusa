import { ProductTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type HandlerInput = {
    products: ProductTypes.CreateProductDTO[];
};
export declare function createProducts({ container, data, }: WorkflowArguments<HandlerInput>): Promise<ProductTypes.ProductDTO[]>;
export declare namespace createProducts {
    var aliases: {
        payload: string;
    };
}
export {};
