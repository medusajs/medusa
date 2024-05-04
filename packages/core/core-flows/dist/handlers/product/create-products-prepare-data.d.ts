import { BigNumberInput, ProductTypes, WorkflowTypes } from "@medusajs/types";
import { WorkflowArguments } from "@medusajs/workflows-sdk";
type ShippingProfileId = string;
type SalesChannelId = string;
type ProductHandle = string;
type VariantIndexAndPrices = {
    index: number;
    prices: {
        region_id?: string;
        currency_code?: string;
        amount: BigNumberInput;
        min_quantity?: BigNumberInput;
        max_quantity?: BigNumberInput;
    }[];
};
export type CreateProductsPreparedData = {
    products: ProductTypes.CreateProductDTO[];
    productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>;
    productsHandleSalesChannelsMap: Map<ProductHandle, SalesChannelId[]>;
    productsHandleVariantsIndexPricesMap: Map<ProductHandle, VariantIndexAndPrices[]>;
};
export declare function createProductsPrepareData({ container, context, data, }: WorkflowArguments<WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO>): Promise<CreateProductsPreparedData>;
export declare namespace createProductsPrepareData {
    var aliases: {
        payload: string;
    };
}
export {};
