import { BigNumberInput } from "@medusajs/types";
interface ConfirmInventoryPreparationInput {
    product_variant_inventory_items: {
        variant_id: string;
        inventory_item_id: string;
        required_quantity: number;
    }[];
    items: {
        variant_id?: string;
        quantity: BigNumberInput;
    }[];
    variants: {
        id: string;
        manage_inventory?: boolean;
    }[];
    location_ids: string[];
}
interface ConfirmInventoryItem {
    inventory_item_id: string;
    required_quantity: number;
    quantity: number;
    location_ids: string[];
}
export declare const prepareConfirmInventoryInput: ({ product_variant_inventory_items, location_ids, items, variants, }: ConfirmInventoryPreparationInput) => ConfirmInventoryItem[];
export {};
