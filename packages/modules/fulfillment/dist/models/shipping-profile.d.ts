import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import ShippingOption from "./shipping-option";
type ShippingProfileOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class ShippingProfile {
    [OptionalProps]?: ShippingProfileOptionalProps;
    id: string;
    name: string;
    type: string;
    shipping_options: Collection<ShippingOption, object>;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
