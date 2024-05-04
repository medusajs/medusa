import { DAL } from "@medusajs/types";
import { Collection, OptionalProps } from "@mikro-orm/core";
import ServiceZone from "./service-zone";
type FulfillmentSetOptionalProps = DAL.SoftDeletableEntityDateColumns;
export default class FulfillmentSet {
    [OptionalProps]?: FulfillmentSetOptionalProps;
    id: string;
    name: string;
    type: string;
    metadata: Record<string, unknown> | null;
    service_zones: Collection<ServiceZone, object>;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    onCreate(): void;
    onInit(): void;
}
export {};
