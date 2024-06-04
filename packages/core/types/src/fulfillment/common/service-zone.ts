import { BaseFilterable, OperatorMap } from "../../dal"
import {
  FilterableFulfillmentSetProps,
  FulfillmentSetDTO,
} from "./fulfillment-set"
import { FilterableGeoZoneProps, GeoZoneDTO } from "./geo-zone"
import { ShippingOptionDTO } from "./shipping-option"

/**
 * The service zone details.
 */
export interface ServiceZoneDTO {
  /**
   * The ID of the service zone.
   */
  id: string

  /**
   * The name of the service zone.
   */
  name: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The ID of the fulfillment set associated with the service zone.
   */
  fulfillment_set_id: string

  /**
   * The fulfillment set assoiated with the service zone.
   */
  fulfillment_set: FulfillmentSetDTO

  /**
   * The geo zones assoiated with the service zone.
   */
  geo_zones: GeoZoneDTO[]

  /**
   * The shipping options assoiated with the service zone.
   */
  shipping_options: ShippingOptionDTO[]

  /**
   * The creation date of the service zone.
   */
  created_at: Date

  /**
   * The update date of the service zone.
   */
  updated_at: Date

  /**
   * The deletion date of the service zone.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved service zones.
 */
export interface FilterableServiceZoneProps
  extends BaseFilterable<FilterableServiceZoneProps> {
  /**
   * The IDs to filter the service zones by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the service zones by their name.
   */
  name?: string | string[] | OperatorMap<string | string[]>

  /**
   * The filters to apply on the associated geo zones.
   */
  geo_zones?: FilterableGeoZoneProps

  /**
   * The filters to apply on the associated fulfillment sets.
   */
  fulfillment_set?: FilterableFulfillmentSetProps

  /**
   * @ignore
   *
   * @privateRemarks
   * Added the `@\ignore` because of the `TODO`. Once implemented, the
   * `@\ignore` (and this comment) should be removed.
   */
  shipping_options?: any // TODO
}
