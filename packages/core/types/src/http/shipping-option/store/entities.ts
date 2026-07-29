import { ShippingOptionPriceType } from "../../../fulfillment"
import { BaseFulfillmentProvider } from "../../fulfillment-provider/common"

/**
 * The details of a shipping option's type.
 */
export interface StoreShippingOptionType {
  /**
   * The shipping option type's ID.
   */
  id: string
  /**
   * The shipping option type's label.
   */
  label: string
  /**
   * The shipping option type's description.
   */
  description: string
  /**
   * The shipping option type's code.
   */
  code: string
  /**
   * The ID of the shipping option this type belongs to.
   */
  shipping_option_id: string
  /**
   * The date the shipping option type was created.
   */
  created_at: string
  /**
   * The date the shipping option type was last updated.
   */
  updated_at: string
  /**
   * The date the shipping option type was deleted.
   */
  deleted_at: string | null
}

/**
 * The details of a shipping option that customers can choose from during checkout.
 */
export interface StoreShippingOption {
  /**
   * The shipping option's ID.
   */
  id: string
  /**
   * The shipping option's name. Customers can see this name during checkout.
   */
  name: string
  /**
   * The type of the shipping option's price:
   *
   * - `flat`: the price is a fixed amount available in the `amount` property.
   * - `calculated`: the price is calculated during checkout by the shipping option's fulfillment provider. Retrieve the price using the [Calculate Shipping Option Price API route](https://docs.medusajs.com/api/store/shipping-options/calculate-shipping-option-price).
   */
  price_type: ShippingOptionPriceType
  /**
   * The ID of the service zone that the shipping option belongs to.
   */
  service_zone_id: string
  /**
   * The ID of the fulfillment provider that processes the shipping option's fulfillments and, for calculated shipping options, computes its price.
   */
  provider_id: string
  /**
   * The fulfillment provider that processes the shipping option's fulfillments.
   * @expandable
   */
  provider: BaseFulfillmentProvider
  /**
   * The ID of the shipping option's type.
   */
  shipping_option_type_id: string | null
  /**
   * The shipping option's type.
   * @expandable
   */
  type: StoreShippingOptionType
  /**
   * The ID of the shipping profile that the shipping option belongs to.
   */
  shipping_profile_id: string
  /**
   * The shipping option's price amount.
   *
   * For a shipping option whose `price_type` is `calculated`, this amount is
   * resolved by the fulfillment provider during checkout, so it isn't reliable
   * until the price is calculated using the Calculate Shipping Option Price API route.
   */
  amount: number
  /**
   * Whether the shipping option's amount is tax inclusive.
   */
  is_tax_inclusive: boolean
  /**
   * Additional data that is useful for the shipping option's fulfillment provider.
   */
  data: Record<string, unknown> | null
  /**
   * Custom key-value pairs that can be added to the shipping option.
   */
  metadata: Record<string, unknown> | null
}
