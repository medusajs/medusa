import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
type StoreOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class Store {
    [OptionalProps]?: StoreOptionalProps;
    id: string;
    name: string;
    supported_currency_codes: string[];
    default_currency_code: string | null;
    default_sales_channel_id: string | null;
    default_region_id: string | null;
    default_location_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
