import { BigNumberInput, CreateOrderAdjustmentDTO, CreateOrderLineItemTaxLineDTO, ProductVariantDTO } from "@medusajs/types";
interface Input {
    quantity: BigNumberInput;
    metadata?: Record<string, any>;
    unitPrice: BigNumberInput;
    variant: ProductVariantDTO;
    taxLines?: CreateOrderLineItemTaxLineDTO[];
    adjustments?: CreateOrderAdjustmentDTO[];
    cartId?: string;
}
export declare function prepareLineItemData(data: Input): any;
export declare function prepareTaxLinesData(data: CreateOrderLineItemTaxLineDTO[]): {
    description: string | undefined;
    tax_rate_id: string | undefined;
    code: string;
    rate: BigNumberInput;
    provider_id: string | undefined;
}[];
export declare function prepareAdjustmentsData(data: CreateOrderAdjustmentDTO[]): {
    code: string | undefined;
    amount: BigNumberInput;
    description: string | undefined;
    promotion_id: string | undefined;
    provider_id: string | undefined;
}[];
export {};
