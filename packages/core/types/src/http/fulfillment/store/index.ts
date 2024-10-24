import { ShippingOptionPriceType } from "../../../fulfillment"

// TODO: The way the cart shipping options are listed now differs from most other endpoints as it is fetched in a workflow.
// We should consider refactoring this to be more consistent with other endpoints.
export interface StoreCartShippingOption {
  /**
   * The shipping option's ID.
   */
  id: string
  /**
   * The shipping option's name.
   */
  name: string
  /**
   * The type of the shipping option's price. `flat` means the price
   * is fixed, whereas `calculated` means the price is calculated by the 
   * associated fulfillment provider.
   */
  price_type: ShippingOptionPriceType
  /**
   * The ID of the associated service zone.
   */
  service_zone_id: string
  /**
   * The ID of the associated shipping profile.
   */
  shipping_profile_id: string
  /**
   * The ID of the fulfillment provider used to handle shipping.
   */
  provider_id: string
  /**
   * The data useful for the fulfillment provider when handling the shipment and fulfillment.
   * 
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data: Record<string, unknown> | null
  /**
   * The shipping option's type.
   */
  type: {
    /**
     * The type's ID.
     */
    id: string
    /**
     * The type's label.
     */
    label: string
    /**
     * The type's description.
     */
    description: string
    /**
     * The type's code.
     */
    code: string
  }
  /**
   * The details of the associated fulfillment provider.
   */
  provider: {
    /**
     * The fulfillment provider's ID.
     */
    id: string
    /**
     * Whether the fulfillment provider is enabled.
     */
    is_enabled: boolean
  }
  /**
   * The shipping option's amount.
   */
  amount: number
}
