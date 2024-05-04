import { BigNumberInput } from "@medusajs/types";
interface Input {
    quantity: BigNumberInput;
    metadata?: Record<string, any>;
    unitPrice: BigNumberInput;
    variant: {
        title: string;
        sku?: string;
        barcode?: string;
    };
}
interface Output {
    quantity: BigNumberInput;
    title: string;
    variant_sku?: string;
    variant_barcode?: string;
    variant_title?: string;
    unit_price: BigNumberInput;
    metadata?: Record<string, any>;
}
export declare function prepareCustomLineItemData(data: Input): Output;
export {};
