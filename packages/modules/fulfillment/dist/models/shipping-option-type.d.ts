import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import ShippingOption from "./shipping-option";
type ShippingOptionTypeOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class ShippingOptionType {
    [OptionalProps]?: ShippingOptionTypeOptionalProps;
    id: string;
    label: string;
    description: string | null;
    code: string;
    shipping_option: ShippingOption;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
