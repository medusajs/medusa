import { CreateShippingOptionTypeDTO } from "./shipping-option-type"
import { ShippingOptionPriceType } from "../common"
import { CreateShippingOptionRuleDTO } from "./shipping-option-rule"

/**
 * The shipping option to be created.
 */
export interface CreateShippingOptionDTO {
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
   * The associated provider's ID.
   */
  provider_id: string

  /**
   * The shipping option type associated with the shipping option.
   */
  type: Omit<CreateShippingOptionTypeDTO, "shipping_option_id">

  /**
   * The data necessary for the associated fulfillment provider to process the shipping option
   * and its associated fulfillments.
   */
  data?: Record<string, unknown> | null

  /**
   * The shipping option rules associated with the shipping option.
   */
  rules?: Omit<CreateShippingOptionRuleDTO, "shipping_option_id">[]
}

/**
 * The attributes to update in the shipping option.
 */
export interface UpdateShippingOptionDTO {
  /**
   * The ID of the shipping option.
   */
  id?: string

  /**
   * The name of the shipping option.
   */
  name?: string

  /**
   * The type of the shipping option's price.
   */
  price_type?: ShippingOptionPriceType

  /**
   * The associated service zone's ID.
   */
  service_zone_id?: string

  /**
   * The associated shipping profile's ID.
   */
  shipping_profile_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string

  /**
   * The shipping option type associated with the shipping option.
   */
  type:
    | Omit<CreateShippingOptionTypeDTO, "shipping_option_id">
    | {
        /**
         * The ID of the shipping option type.
         */
        id: string
      }

  /**
   * The data necessary for the associated fulfillment provider to process the shipping option
   * and its associated fulfillments.
   */
  data?: Record<string, unknown> | null

  /**
   * The shipping option rules associated with the shipping option.
   */
  rules?: (
    | Omit<CreateShippingOptionRuleDTO, "shipping_option_id">
    | {
        /**
         * The ID of the shipping option rule.
         */
        id: string
      }
  )[]
}

/**
 * A shipping option to be created or updated.
 */
export interface UpsertShippingOptionDTO extends UpdateShippingOptionDTO {}
