import { CreateServiceZoneDTO } from "./service-zone";
/**
 * The fulfillment set to be created.
 */
export interface CreateFulfillmentSetDTO {
    /**
     * The name of the fulfillment set.
     */
    name: string;
    /**
     * The type of the fulfillment set.
     */
    type: string;
    /**
     * The service zones associated with the fulfillment set.
     */
    service_zones?: Omit<CreateServiceZoneDTO, "fulfillment_set_id">[];
}
/**
 * The attributes to update in the fulfillment set.
 */
export interface UpdateFulfillmentSetDTO {
    /**
     * The ID of the fulfillment set.
     */
    id: string;
    /**
     * The name of the fulfillment set.
     */
    name?: string;
    /**
     * The type of the fulfillment set.
     */
    type?: string;
    /**
     * The service zones associated with the fulfillment set.
     */
    service_zones?: (Omit<CreateServiceZoneDTO, "fulfillment_set_id"> | {
        /**
         * The ID of the service zone.
         */
        id: string;
    })[];
}
//# sourceMappingURL=fulfillment-set.d.ts.map