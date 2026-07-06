/**
 * The details of the price calculation.
 */
export type StoreCalculateShippingOptionPrice = {
  /**
   * The ID of the cart to calculate the price for.
   */
  cart_id: string
  /**
   * Additional data passed to the shipping option's fulfillment provider. This is useful
   * if the third-party fulfillment provider requires additional data to calculate the price.
   *
   * Learn more in the [Shipping Option documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data?: Record<string, unknown>
}
