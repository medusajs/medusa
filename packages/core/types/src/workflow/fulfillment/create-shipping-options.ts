import { ShippingOptionDTO } from "../../fulfillment"
import { RuleOperatorType } from "../../common"
import { PriceRule } from "../../pricing"

type CreateFlatRateShippingOptionPriceRecord =
  | {
      currency_code: string
      amount: number
      rules?: PriceRule[]
    }
  | {
      region_id: string
      amount: number
      rules?: PriceRule[]
    }

/**
 * The details of the shipping option to create.
 */
type CreateFlatShippingOptionInputBase = {
  /**
   * The name of the shipping option.
   */
  name: string
  /**
   * The ID of the service zone the shipping option belongs to.
   */
  service_zone_id: string
  /**
   * The ID of the shipping profile the shipping option belongs to.
   */
  shipping_profile_id: string
  /**
   * Custom data that's necessary for the shipping option's fulfillment provider.
   * Learn more about this property in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data?: Record<string, unknown>
  /**
   * The ID of the shipping option's fulfillment provider.
   */
  provider_id: string
  /**
   * The type of the shipping option.
   */
  type?: {
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
  /**
   * The ID of the type of shipping option.
   */
  type_id?: string
  /**
   * The rules that determine when the shipping option is available.
   */
  rules?: {
    /**
     * The attribute to match against.
     * @example
     * customer_group
     */
    attribute: string
    /**
     * The operator to use when matching the attribute.
     *
     * @example
     * in
     */
    operator: RuleOperatorType
    /**
     * The value to match against.
     *
     * @example
     * cusgrp_123
     */
    value: string | string[]
  }[]
}

/**
 * The data to create a flat-rate shipping option.
 */
type CreateFlatRateShippingOptionInput = CreateFlatShippingOptionInputBase & {
  /**
   * The type of the shipping option's price.
   */
  price_type: "flat"
  /**
   * The prices for the shipping option. Only required if the price type is `flat`.
   */
  prices: CreateFlatRateShippingOptionPriceRecord[]
}

/**
 * The data to create a calculated shipping option.
 */
type CreateCalculatedShippingOptionInput = CreateFlatShippingOptionInputBase & {
  /**
   * The type of the shipping option's price.
   */
  price_type: "calculated"
}

/**
 * The data to create a flat rate or calculated shipping option.
 */
export type CreateShippingOptionsWorkflowInput =
  CreateFlatRateShippingOptionInput | CreateCalculatedShippingOptionInput

/**
 * The created shipping options.
 */
export type CreateShippingOptionsWorkflowOutput = ShippingOptionDTO[]
