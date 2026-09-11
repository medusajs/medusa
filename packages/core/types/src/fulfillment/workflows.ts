import { CalculatedShippingOptionPrice, StockLocationAddressDTO } from ".."
import { ShippingOptionPriceType, ShippingOptionTypeDTO } from "./common"
import {
  CreateShippingOptionRuleDTO,
  UpdateShippingOptionRuleDTO,
} from "./mutations"

/**
 * The data to create shipping option rules.
 */
export type AddFulfillmentShippingOptionRulesWorkflowDTO = {
  /**
   * The shipping option rules to create.
   */
  data: CreateShippingOptionRuleDTO[]
}

/**
 * The data to delete shipping option rules.
 */
export type RemoveFulfillmentShippingOptionRulesWorkflowDTO = {
  /**
   * The IDs of the shipping option rules to delete.
   */
  ids: string[]
}

/**
 * The data to update shipping option rules.
 */
export type UpdateFulfillmentShippingOptionRulesWorkflowDTO = {
  /**
   * The shipping option rules to update.
   */
  data: UpdateShippingOptionRuleDTO[]
}

/**
 * The context for retrieving the shipping options.
 */
export type ListShippingOptionsForCartWithPricingWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id: string
  /**
   * Specify the shipping options to retrieve their details and prices.
   * If not provided, all applicable shipping options are retrieved.
   */
  options?: {
    /**
     * The shipping option's ID.
     */
    id: string
    /**
     * Custom data relevant for the fulfillment provider that processes this shipping option.
     * It can be data relevant to calculate the shipping option's price.
     *
     * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
     */
    data?: Record<string, unknown>
  }[]
  /**
   * Whether to retrieve return shipping options.
   * By default, non-return shipping options are retrieved.
   *
   * @defaultValue false
   */
  is_return?: boolean
  /**
   * Whether to retrieve the shipping option's enabled in the store, which is the default.
   *
   * @defaultValue true
   */
  enabled_in_store?: boolean
}

/**
 * The retrieved shipping options with prices.
 */
export type ListShippingOptionsForCartWithPricingWorkflowOutput = {
  /**
   * The shipping option's ID.
   */
  id: string

  /**
   * The name of the shipping option.
   */
  name: string

  /**
   * The shipping option's price type.
   */
  price_type: ShippingOptionPriceType

  /**
   * The associated service zone's ID.
   */
  service_zone_id: string

  /**
   * The service zone details.
   */
  service_zone: {
    /**
     * The ID of the fulfillment set associated with the service zone.
     */
    fulfillment_set_id: string
  }

  /**
   * The ID of the associated shipping profile.
   */
  shipping_profile_id: string

  /**
   * The ID of the associated fulfillment provider. It's used to calculate
   * the shipping option's price, if it's price type is `calculated`, and later
   * it processes shipments created from this shipping option.
   */
  provider_id: string

  /**
   * Custom additional data related to the shipping option, useful for the fulfillment provider
   * to process the shipping option and calculate its price.
   *
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data: Record<string, unknown>

  /**
   * The shipping option's type.
   */
  type: Omit<
    ShippingOptionTypeDTO,
    | "shipping_option_id"
    | "shipping_option"
    | "created_at"
    | "updated_at"
    | "deleted_at"
  >

  /**
   * The associated fulfillment provider details.
   */
  provider: {
    /**
     * The ID of the provider.
     */
    id: string

    /**
     * Whether the provider is enabled.
     */
    is_enabled: boolean
  }

  /**
   * The shipping option rules associated with the shipping option.
   */
  rules: {
    /**
     * The name of a property or table that the rule applies to.
     *
     * @example
     * customer_group
     */
    attribute: string

    /**
     * The value of the rule.
     */
    value: string

    /**
     * The operator of the rule.
     *
     * @example
     * in
     */
    operator: string
  }[]

  /**
   * The amount for the shipping option, which can be flat rate or calculated.
   */
  amount: number | undefined

  /**
   * Indicates whether taxes are included in the shipping option amount.
   */
  is_tax_inclusive: boolean | undefined

  /**
   * The calculated price for the shipping option, if its `price_type` is `calculated`.
   */
  calculated_price?: CalculatedShippingOptionPrice

  /**
   * The details of the associated stock location, which is set if the shipping option's `price_type` is `calculated`.
   */
  stock_location?: {
    /**
     * The ID of the stock location.
     */
    id: string

    /**
     * The name of the stock location.
     */
    name: string

    /**
     * The address of the stock location.
     */
    address: StockLocationAddressDTO

    /**
     * The ID of the fulfillment set associated with the stock location.
     */
    fulfillment_set_id: string
  }
}[]

/**
 * The context for retrieving the shipping options.
 */
export type ListShippingOptionsForCartWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id: string
  /**
   * Specify the shipping options to retrieve their details.
   * If not specified, all applicable shipping options are retrieved.
   */
  option_ids?: string[]
  /**
   * The fields and relations to retrieve in the shipping option. These fields
   * are passed to [Query](https://docs.medusajs.com/learn/fundamentals/query),
   * so you can pass names of custom models linked to the shipping option.
   */
  fields?: string[]
  /**
   * Whether to retrieve return shipping options.
   * By default, non-return shipping options are retrieved.
   *
   * @defaultValue false
   */
  is_return?: boolean
  /**
   * Whether to retrieve the shipping option's enabled in the store, which is the default.
   *
   * @defaultValue true
   */
  enabled_in_store?: boolean
}

/**
 * The context for retrieving the shipping options.
 */
export type ListShippingOptionsForOrderWorkflowInput = {
  /**
   * The order's ID.
   */
  order_id: string
  /**
   * Whether to retrieve return shipping options.
   * By default, non-return shipping options are retrieved.
   *
   * @defaultValue false
   */
  is_return?: boolean
  /**
   * Whether to retrieve the shipping option's enabled in the store, which is the default.
   */
  enabled_in_store?: boolean
}
