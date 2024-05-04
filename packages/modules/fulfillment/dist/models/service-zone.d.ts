import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import FulfillmentSet from "./fulfillment-set";
import GeoZone from "./geo-zone";
import ShippingOption from "./shipping-option";
type ServiceZoneOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class ServiceZone {
    [OptionalProps]?: ServiceZoneOptionalProps;
    id: string;
    name: string;
    metadata: Record<string, unknown> | null;
    fulfillment_set_id: string;
    fulfillment_set: FulfillmentSet;
    geo_zones: Collection<GeoZone, object>;
    shipping_options: Collection<ShippingOption, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
