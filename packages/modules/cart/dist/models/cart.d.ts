import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import Address from "./address";
import LineItem from "./line-item";
import ShippingMethod from "./shipping-method";
type OptionalCartProps = "shipping_address" | "billing_address" | DAL.SoftDeletableEntityDateColumns;
export default class Cart {
    [OptionalProps]?: OptionalCartProps;
    id: string;
    region_id: string | null;
    customer_id: string | null;
    sales_channel_id: string | null;
    email: string | null;
    currency_code: string;
    shipping_address_id: string | null;
    shipping_address: Address | null;
    billing_address_id: string | null;
    billing_address: Address | null;
    metadata: Record<string, unknown> | null;
    items: Collection<LineItem, object>;
    shipping_methods: Collection<ShippingMethod, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
