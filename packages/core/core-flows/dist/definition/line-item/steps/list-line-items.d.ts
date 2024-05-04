import { CartLineItemDTO, FilterableLineItemProps, FindConfig } from "@medusajs/types";
interface StepInput {
    filters: FilterableLineItemProps;
    config?: FindConfig<CartLineItemDTO>;
}
export declare const listLineItemsStepId = "list-line-items";
export declare const listLineItemsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, CartLineItemDTO[]>;
export {};
