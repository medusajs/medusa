import { BigNumberInput, ProductDTO, SalesChannelDTO, WorkflowTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ProductWithSalesChannelsDTO = ProductDTO & {
    sales_channels?: SalesChannelDTO[];
};
type VariantPrice = {
    region_id?: string;
    currency_code?: string;
    amount: BigNumberInput;
    min_quantity?: BigNumberInput;
    max_quantity?: BigNumberInput;
};
export type UpdateProductsPreparedData = {
    originalProducts: ProductWithSalesChannelsDTO[];
    productHandleAddedChannelsMap: Map<string, string[]>;
    productHandleRemovedChannelsMap: Map<string, string[]>;
    variantPricesMap: Map<string, VariantPrice[]>;
};
export declare function updateProductsPrepareData({ container, context, data, }: WorkflowArguments<WorkflowTypes.ProductWorkflow.UpdateProductsWorkflowInputDTO>): Promise<UpdateProductsPreparedData>;
export declare namespace updateProductsPrepareData {
    var aliases: {
        preparedData: string;
    };
}
export {};
