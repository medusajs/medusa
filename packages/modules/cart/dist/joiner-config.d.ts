import { ModuleJoinerConfig } from "@medusajs/types";
import { MapToConfig } from "@medusajs/utils";
export declare const LinkableKeys: {
    cart_id: string;
    line_item_id: string;
    shipping_method_id: string;
    address_id: string;
    line_item_adjustment_id: string;
    shipping_method_adjustment_id: string;
    line_item_tax_line_id: string;
    shipping_method_tax_line_id: string;
};
export declare const entityNameToLinkableKeysMap: MapToConfig;
export declare const joinerConfig: ModuleJoinerConfig;
