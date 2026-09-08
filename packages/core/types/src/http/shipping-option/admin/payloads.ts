import { RuleOperatorType } from "../../../common"
import { ShippingOptionPriceType } from "../../../fulfillment"
import { PriceRule } from "../../../pricing"

export interface AdminCreateShippingOptionRule {
  /**
   * The operator of the shipping option rule.
   */
  operator: RuleOperatorType
  /**
   * The attribute of the shipping option rule.
   *
   * @example
   * `enabled_in_store`
   */
  attribute: string
  /**
   * The value of the shipping option rule.
   *
   * @example
   * `true`
   */
  value: string | string[]
}

interface AdminCreateShippingOptionType {
  /**
   * The label of the shipping option type.
   */
  label: string
  /**
   * The description of the shipping option type.
   */
  description?: string
  /**
   * The code of the shipping option type.
   */
  code: string
}

interface AdminShippingOptionPriceWithRules {
  /**
   * The rules of the shipping option price that
   * indicate when the price should be applied.
   */
  rules?: PriceRule[]
}

export interface AdminCreateShippingOptionPriceWithCurrency
  extends AdminShippingOptionPriceWithRules {
  /**
   * The currency code of the shipping option price.
   *
   * @example
   * "usd"
   */
  currency_code: string
  /**
   * The amount of the shipping option price.
   */
  amount: number
}

export interface AdminCreateShippingOptionPriceWithRegion
  extends AdminShippingOptionPriceWithRules {
  /**
   * The ID of the region that the shipping option price belongs to.
   */
  region_id: string
  /**
   * The amount of the shipping option price.
   */
  amount: number
}

/**
 * Common properties for all shipping option create inputs.
 */
interface AdminCreateShippingOptionBase {
  /**
   * The name of the shipping option. Customers can
   * view this name during checkout.
   *
   * @example
   * "Standard Shipping"
   */
  name: string
  /**
   * The ID of the service zone that the shipping option belongs to.
   *
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#service-zone-restrictions)
   * documentation.
   */
  service_zone_id: string
  /**
   * The ID of the shipping profile that the shipping option belongs to.
   *
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  shipping_profile_id: string
  /**
   * Additional data that is useful for third-party fulfillment providers
   * that process fulfillments for the shipping option.
   *
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property)
   * documentation.
   */
  data?: Record<string, unknown>
  /**
   * The type of the shipping option's price:
   *
   * - `flat`: the price is a fixed amount set in the `prices` property.
   * - `calculated`: the price is calculated during checkout by the shipping option's fulfillment provider.
   */
  price_type: ShippingOptionPriceType
  /**
   * The ID of the fulfillment provider that the shipping option belongs to.
   */
  provider_id: string
  /**
   * The type of shipping option.
   *
   * Learn more in the [Shipping Option](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  type?: AdminCreateShippingOptionType
  /**
   * The ID of the type of shipping option.
   *
   * Learn more in the [Shipping Option](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  type_id?: string
  /**
   * The rules of the shipping option.
   *
   * Learn more in the [Shipping Option Rules](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-option-rules)
   * documentation.
   */
  rules?: AdminCreateShippingOptionRule[]
  /**
   * Custom key-value pairs that can be added to the shipping option.
   *
   * @since 2.11.0
   */
  metadata?: Record<string, unknown>
}

/**
 * The details of a flat-rate shipping option to create. A flat-rate shipping option
 * has a fixed price set in the `prices` property.
 */
export interface AdminCreateFlatRateShippingOption
  extends AdminCreateShippingOptionBase {
  /**
   * The shipping option's price type. `flat` indicates that the price is a fixed
   * amount set in the `prices` property.
   */
  price_type: "flat"
  /**
   * The shipping option's prices, each for a different currency or region.
   */
  prices: (
    | AdminCreateShippingOptionPriceWithCurrency
    | AdminCreateShippingOptionPriceWithRegion
  )[]
}

/**
 * The details of a calculated shipping option to create. A calculated shipping option's
 * price is calculated during checkout by its fulfillment provider, rather than being set
 * to a fixed amount.
 */
export interface AdminCreateCalculatedShippingOption
  extends AdminCreateShippingOptionBase {
  /**
   * The shipping option's price type. `calculated` indicates that the price is calculated
   * during checkout by the shipping option's fulfillment provider.
   */
  price_type: "calculated"
  /**
   * The shipping option's prices, each for a different currency or region.
   */
  prices: (
    | AdminCreateShippingOptionPriceWithCurrency
    | AdminCreateShippingOptionPriceWithRegion
  )[]
}

export type AdminCreateShippingOption =
  | AdminCreateFlatRateShippingOption
  | AdminCreateCalculatedShippingOption

export interface AdminUpdateShippingOptionRule
  extends AdminCreateShippingOptionRule {
  /**
   * The ID of the shipping option rule that is being updated.
   */
  id: string
}

export interface AdminUpdateShippingOptionPriceWithCurrency
  extends AdminShippingOptionPriceWithRules {
  /**
   * The ID of the shipping option price that is being updated.
   * If not provided, a new shipping option price will be created.
   */
  id?: string
  /**
   * The currency code of the shipping option price.
   *
   * @example
   * "usd"
   */
  currency_code?: string
  /**
   * The amount of the shipping option price.
   */
  amount?: number
}

export interface AdminUpdateShippingOptionPriceWithRegion
  extends AdminShippingOptionPriceWithRules {
  /**
   * The ID of the shipping option price that is being updated.
   * If not provided, a new shipping option price will be created.
   */
  id?: string
  /**
   * The ID of the region that the shipping option price belongs to.
   */
  region_id?: string
  /**
   * The amount of the shipping option price.
   */
  amount?: number
}

export interface AdminUpdateShippingOption {
  /**
   * The name of the shipping option. Customers can
   * view this name during checkout.
   *
   * @example
   * "Standard Shipping"
   */
  name?: string
  /**
   * Additional data that is useful for third-party fulfillment providers
   * that process fulfillments for the shipping option.
   */
  data?: Record<string, unknown>
  /**
   * The type of shipping option's price.
   */
  price_type?: ShippingOptionPriceType
  /**
   * The ID of the fulfillment provider that the shipping option belongs to.
   */
  provider_id?: string
  /**
   * The ID of the shipping profile that the shipping option belongs to.
   *
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  shipping_profile_id?: string
  /**
   * The type of shipping option.
   *
   * Learn more in the [Shipping Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  type?: AdminCreateShippingOptionType
  /**
   * The ID of the type of shipping option.
   *
   * Learn more in the [Shipping Option](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-profile-and-types)
   * documentation.
   */
  type_id?: string
  /**
   * The prices of the shipping option.
   */
  prices?: (
    | AdminUpdateShippingOptionPriceWithCurrency
    | AdminUpdateShippingOptionPriceWithRegion
  )[]
  /**
   * The rules of the shipping option.
   *
   * Learn more in the [Shipping Option Rules](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#shipping-option-rules)
   * documentation.
   */
  rules?: (AdminUpdateShippingOptionRule | AdminCreateShippingOptionRule)[]
  /**
   * Custom key-value pairs that can be added to the shipping option.
   *
   * @since 2.11.0
   */
  metadata?: Record<string, unknown>
}

export interface AdminUpdateShippingOptionRules {
  /**
   * The rules to create.
   */
  create?: any[]
  /**
   * The rules to update.
   */
  update?: any[]
  /**
   * The rules to delete.
   */
  delete?: string[]
}
