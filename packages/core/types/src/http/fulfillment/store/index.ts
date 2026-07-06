import { ShippingOptionPriceType } from "../../../fulfillment"
import { StoreCalculatedPrice, StorePrice } from "../../price-preference/store/entities"

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

  /**
   * All the prices for this shipping option
   */
  prices: StorePrice[]

  /**
   * Calculated price for the shipping option
   */
  calculated_price: StoreCalculatedPrice

  /**
   * Whether the stock location of the shipping option has insufficient inventory for items in the cart.
   */
  insufficient_inventory: boolean
}

export type StoreCartShippingOptionWithServiceZone = StoreCartShippingOption & {
  /**
   * The associated service zone.
   */
  service_zone: {
    /**
     * The service zone's ID.
     */
    id: string
    /**
     * The fulfillment set's id.
     */
    fulfillment_set_id: string
    /**
     * The details of the associated fulfillment set.
     */
    fulfillment_set: {
      /**
       * The fulfillment set's ID.
       */
      id: string
      /**
       * The fulfillment set's type.
       */
      type: string
      /**
       * The fulfillment set's location.
       */
      location: {
        /**
         * The location's ID.
         */
        id: string
        /**
         * The address details.
         */
        address: StoreFulfillmentAddress
      }
    }
  }
}

interface StoreFulfillmentAddress {
  /**
   * The address's ID.
   */
  id: string
  /**
   * The address's company.
   */
  company: string | null
  /**
   * The address's first line.
   */
  address_1: string | null
  /**
   * The address's last line.
   */
  address_2: string | null
  /**
   * The address's city.
   */
  city: string | null
  /**
   * The address's country code.
   *
   * @example
   * us
   */
  country_code: string | null
  /**
   * The address's lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province.
   */
  province: string | null
  /**
   * The address's postal code.
   */
  postal_code: string | null
  /**
   * The address's phone number.
   */
  phone: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the address was created.
   */
  created_at: string
  /**
   * The date the address was updated.
   */
  updated_at: string
  /**
   * The date the address was deleted.
   */
  deleted_at: string | null
}

