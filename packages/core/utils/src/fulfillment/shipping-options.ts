/**
 * The type of a shipping option's price, which determines how the price
 * customers pay for the shipping option is resolved.
 */
export enum ShippingOptionPriceType {
  /**
   * The price is calculated dynamically during checkout by the shipping
   * option's fulfillment provider. The shipping option has no stored prices;
   * instead, the provider's `calculatePrice` method is invoked to resolve the
   * amount against the cart. This is useful when prices depend on the cart's
   * contents, destination, or a third-party rate service.
   */
  CALCULATED = "calculated",
  /**
   * The price is a fixed amount stored in the Pricing Module and resolved
   * against the cart's currency and region. The fulfillment provider isn't
   * invoked to compute the price.
   */
  FLAT = "flat",
}
