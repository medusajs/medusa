import { FilterableServiceZoneProps, ServiceZoneDTO } from "./service-zone";
import { BaseFilterable } from "../../dal";
/**
 * The fulfillment set details.
 */
export interface FulfillmentSetDTO {
    /**
     * The ID of the fulfillment set.
     */
    id: string;
    /**
     * The name of the fulfillment set.
     */
    name: string;
    /**
     * The type of the fulfillment set.
     */
    type: string;
    /**
     * Holds custom data in key-value pairs.
     */
    metadata: Record<string, unknown> | null;
    /**
     * The service zones associated with the fulfillment set.
     */
    service_zones: ServiceZoneDTO[];
    /**
     * The creation date of the fulfillment set.
     */
    created_at: Date;
    /**
     * The update date of the fulfillment set.
     */
    updated_at: Date;
    /**
     * The deletion date of the fulfillment set.
     */
    deleted_at: Date | null;
}
/**
 * The filters to apply on the retrieved fulfillment sets.
 */
export interface FilterableFulfillmentSetProps extends BaseFilterable<FilterableFulfillmentSetProps> {
    /**
     * The IDs to filter the fulfillment sets by.
     */
    id?: string | string[];
    /**
     * Filter the fulfillment sets by their name.
     */
    name?: string | string[];
    /**
     * Filter the fulfillment sets by their type.
     */
    type?: string | string[];
    /**
     * The filters to apply on the retrieved service zones.
     */
    service_zones?: FilterableServiceZoneProps;
}
//# sourceMappingURL=fulfillment-set.d.ts.map