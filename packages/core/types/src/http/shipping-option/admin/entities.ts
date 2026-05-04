import { RuleOperatorType } from "../../../common"
import { ShippingOptionPriceType } from "../../../fulfillment"
import { AdminFulfillmentProvider } from "../../fulfillment-provider"
import { AdminServiceZone } from "../../fulfillment-set"
import { AdminPrice } from "../../price-preference"
import { AdminShippingProfile } from "../../shipping-profile"

export interface AdminShippingOptionType {
  /**
   * The ID of the shipping option type.
   */
  id: string
  /**
   * The label of the shipping option type.
   */
  label: string
  /**
   * The description of the shipping option type.
   */
  description: string
  /**
   * The code of the shipping option type.
   */
  code: string
  /**
   * The ID of the shipping option that this type is created for.
   */
  shipping_option_id: string
  /**
   * The date when the shipping option type was created.
   */
  created_at: string
  /**
   * The date when the shipping option type was updated.
   */
  updated_at: string
  /**
   * The date when the shipping option type was deleted.
   */
  deleted_at: string | null
}

export interface AdminShippingOptionRule {
  /**
   * The ID of the shipping option rule.
   */
  id: string
  /**
   * The attribute of the shipping option rule.
   * 
   * @example
   * "enabled_in_store"
   */
  attribute: string
  /**
   * The operator of the shipping option rule.
   * 
   * @example
   * "eq"
   */
  operator: RuleOperatorType
  /**
   * The value of the shipping option rule.
   * 
   * @example
   * "true"
   */
  value: string | string[] | null
  /**
   * The ID of the shipping option that this rule is created for.
   */
  shipping_option_id: string
  /**
   * The date when the shipping option rule was created.
   */
  created_at: string
  /**
   * The date when the shipping option rule was updated.
   */
  updated_at: string
  /**
   * The date when the shipping option rule was deleted.
   */
  deleted_at: string | null
}

/**
 * @privateRemarks
 * 
 * TODO: This type is complete, but it's not clear what the `rules` field is supposed to return in all cases.
 */
export interface AdminShippingOptionPriceRule {
  /**
   * The ID of the shipping option price rule.
   */
  id: string
  /**
   * The value of the shipping option price rule.
   * 
   * @example
   * "region_123"
   */
  value: string | number
  /**
   * The operator of the shipping option price rule.
   * 
   * @example
   * "eq"
   */
  operator: RuleOperatorType
  /**
   * The attribute of the shipping option price rule.
   * 
   * @example
   * "region_id"
   */
  attribute: string
  /**
   * The ID of the shipping option price that this rule is created for.
   */
  price_id: string
  /**
   * The priority of the shipping option price rule.
   */
  priority: number
  /**
   * The date when the shipping option price rule was created.
   */
  created_at: string
  /**
   * The date when the shipping option price rule was updated.
   */
  updated_at: string
  /**
   * The date when the shipping option price rule was deleted.
   */
  deleted_at: string | null
}

export interface AdminShippingOptionPrice extends AdminPrice {
  /**
   * The rules of the shipping option price.
   */
  price_rules: AdminShippingOptionPriceRule[]
  /**
   * The number of rules of the shipping option price.
   */
  rules_count: number
}

export interface AdminShippingOption {
  /**
   * The shipping option's ID.
   */
  id: string
  /**
   * The shipping option's name. Customers can
   * see this name during checkout.
   * 
   * @example
   * "Standard Shipping"
   */
  name: string
  /**
   * The type of shipping option's price.
   */
  price_type: ShippingOptionPriceType
  /**
   * The ID of the service zone that the shipping option belongs to.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#service-zone-restrictions)
   * documentation.
   */
  service_zone_id: string
  /**
   * The service zone that the shipping option belongs to.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#service-zone-restrictions)
   * documentation.
   */
  service_zone: AdminServiceZone
  /**
   * The ID of the fulfillment provider that the shipping option belongs to.
   */
  provider_id: string
  /**
   * The fulfillment provider that the shipping option belongs to.
   */
  provider: AdminFulfillmentProvider
  /**
   * The ID of the shipping option's type.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  shipping_option_type_id: string | null
  /**
   * The shipping option's type.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  type: AdminShippingOptionType
  /**
   * The ID of the shipping profile that the shipping option belongs to.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  shipping_profile_id: string
  /**
   * The shipping profile that the shipping option belongs to.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  shipping_profile: AdminShippingProfile
  /**
   * The rules of the shipping option.
   * 
   * Learn more in the [Shipping Option Rules](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-option-rules)
   * documentation.
   */
  rules: AdminShippingOptionRule[]
  /**
   * The prices of the shipping option.
   */
  prices: AdminShippingOptionPrice[]
  /**
   * Additional data that is useful for third-party fulfillment providers
   * that process fulfillments for the shipping option.
   * 
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property)
   * documentation.
   */
  data: Record<string, unknown> | null
  /**
   * Custom key-value pairs that can be added to the shipping option.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date when the shipping option was created.
   */
  created_at: Date
  /**
   * The date when the shipping option was updated.
   */
  updated_at: Date
  /**
   * The date when the shipping option was deleted.
   */
  deleted_at: Date | null
}
