import { GeoZoneType } from "@medusajs/utils";
import { DAL } from "@medusajs/types";
import { OptionalProps } from "@mikro-orm/core";
import ServiceZone from "./service-zone";
type GeoZoneOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class GeoZone {
    [OptionalProps]?: GeoZoneOptionalProps;
    id: string;
    type: GeoZoneType;
    country_code: string;
    province_code: string | null;
    city: string | null;
    service_zone_id: string;
    postal_expression: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    service_zone: ServiceZone;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
