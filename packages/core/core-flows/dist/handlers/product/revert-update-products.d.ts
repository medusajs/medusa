import { ProductDTO, ProductVariantDTO } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
import { UpdateProductsPreparedData } from "./update-products-prepare-data";
type HandlerInput = UpdateProductsPreparedData & {
    variants: ProductVariantDTO[];
};
export declare function revertUpdateProducts({ container, data, }: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]>;
export declare namespace revertUpdateProducts {
    var aliases: {
        preparedData: string;
        variants: string;
    };
}
export {};
