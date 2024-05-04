import { BigNumberInput, ProductWorkflow, WorkflowTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type VariantPrice = {
    region_id?: string;
    currency_code?: string;
    amount: BigNumberInput;
    min_quantity?: BigNumberInput;
    max_quantity?: BigNumberInput;
};
export type UpdateProductVariantsPreparedData = {
    productVariants: ProductWorkflow.UpdateProductVariantsInputDTO[];
    variantPricesMap: Map<string, VariantPrice[]>;
    productVariantsMap: Map<string, ProductWorkflow.UpdateProductVariantsInputDTO[]>;
};
export declare function updateProductVariantsPrepareData({ container, context, data, }: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductVariantsWorkflowInputDTO>): Promise<UpdateProductVariantsPreparedData>;
export declare namespace updateProductVariantsPrepareData {
    var aliases: {
        payload: string;
    };
}
export {};
