export interface BaseFulfillmentProvider {
  /**
   * The fulfillment provider's ID.
   */
  id: string
  /**
   * Whether the fulfillment provider is enabled.
   */
  is_enabled: boolean
}

export interface BaseFulfillmentProviderOption {
  /**
   * The fulfillment provider option's ID.
   */
  id: string
  /**
   * Whether the fulfillment provider option can be used for returns.
   */
  is_return: boolean
  /**
   * Additional properties of the fulfillment provider option.
   * These are provider-specific and can include any additional data relevant to the option.
   * 
   * It may commonly include properties like `name` (the name of the option).
   */
  [k: string]: unknown
}
