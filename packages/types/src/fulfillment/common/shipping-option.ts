import { BaseFilterable, OperatorMap } from "../../dal"
import { FulfillmentDTO } from "./fulfillment"
import { FulfillmentProviderDTO } from "./fulfillment-provider"
import { FilterableServiceZoneProps, ServiceZoneDTO } from "./service-zone"
import {
  FilterableShippingOptionRuleProps,
  ShippingOptionRuleDTO,
} from "./shipping-option-rule"
import {
  FilterableShippingOptionTypeProps,
  ShippingOptionTypeDTO,
} from "./shipping-option-type"
import { ShippingProfileDTO } from "./shipping-profile"

/**
 * The shipping option's price type.
 *
 * - Use `calculated` if the shipping option's price amount is calculated by the fulfillment provider.
 * - Use `flat_rate` if the shipping option's price is always the same amount.
 *
 */
export type ShippingOptionPriceType = "calculated" | "flat"

/**
 * The shipping option details.
 */
export interface ShippingOptionDTO {
  /**
   * The ID of the shipping option.
   */
  id: string

  /**
   * The name of the shipping option.
   */
  name: string

  /**
   * The type of the shipping option's price.
   */
  price_type: ShippingOptionPriceType

  /**
   * The associated service zone's ID.
   */
  service_zone_id: string

  /**
   * The associated shipping profile's ID.
   */
  shipping_profile_id: string

  /**
   * The associated fulfillment provider's ID.
   */
  provider_id: string

  /**
   * The associated shipping option type's ID.
   */
  shipping_option_type_id: string | null

  /**
   * The data necessary for the associated fulfillment provider to process the shipping option
   * and, later, its associated fulfillments.
   */
  data: Record<string, unknown> | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The associated service zone.
   */
  service_zone: ServiceZoneDTO

  /**
   * The associated shipping profile.
   */
  shipping_profile: ShippingProfileDTO

  /**
   * The associated fulfillment provider.
   */
  fulfillment_provider: FulfillmentProviderDTO

  /**
   * The associated shipping option type.
   */
  type: ShippingOptionTypeDTO

  /**
   * The rules associated with the shipping option.
   */
  rules: ShippingOptionRuleDTO[]

  /**
   * The fulfillments associated with the shipping option.
   */
  fulfillments: FulfillmentDTO[]

  /**
   * The creation date of the shipping option.
   */
  created_at: Date

  /**
   * The update date of the shipping option.
   */
  updated_at: Date

  /**
   * The deletion date of the shipping option.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved shipping options.
 */
export interface FilterableShippingOptionProps
  extends BaseFilterable<FilterableShippingOptionProps> {
  /**
   * The IDs to filter the shipping options by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping options by their name.
   */
  name?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping options by the ID of their associated shipping profile.
   */
  shipping_profile_id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping options by their price type.
   */
  price_type?:
    | ShippingOptionPriceType
    | ShippingOptionPriceType[]
    | OperatorMap<ShippingOptionPriceType | ShippingOptionPriceType[]>

  /**
   * The filters to apply on the retrieved service zones.
   */
  service_zone?: FilterableServiceZoneProps

  /**
   * The filters to apply on the retrieved shipping option types.
   */
  shipping_option_type?: FilterableShippingOptionTypeProps

  /**
   * The filters to apply on the retrieved shipping option rules.
   */
  rules?: FilterableShippingOptionRuleProps
}

/**
 * A context's details used to filter the shipping option.
 */
export interface FilterableShippingOptionForContextProps
  extends FilterableShippingOptionProps {
  /**
   * The fulfillment set's ID used in the context.
   */
  fulfillment_set_id?: string | string[] | OperatorMap<string | string[]>

  /**
   * The fulfillment set's type used in the context.
   */
  fulfillment_set_type?: string | string[] | OperatorMap<string | string[]>

  /**
   * The address used in the context. It filters the shipping options based on
   * the geo zones of their associated service zone.
   *
   * @privateRemarks
   * The address is a shortcut to filter through geo_zones
   * and build opinionated validation and filtering around the geo_zones.
   * For custom filtering you can go through the service_zone.geo_zones directly.
   */
  address?: {
    /**
     * The ISO 2 character country code.
     */
    country_code?: string

    /**
     * The province code.
     */
    province_code?: string

    /**
     * The city.
     */
    city?: string

    /**
     * The postal expression
     */
    postal_expression?: string
  }

  /**
   * The shipping option's context to filter directly.
   */
  context?: Record<string, any>
}
