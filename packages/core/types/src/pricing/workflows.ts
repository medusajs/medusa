import { PricingTypes } from "../bundles"
import { PriceListStatus } from "./common"

/**
 * The data to create a price list's price.
 */
export interface CreatePriceListPriceWorkflowDTO {
  /**
   * The amount for the price.
   */
  amount: number

  /**
   * The currency code for the price.
   * 
   * @example
   * usd
   */
  currency_code: string

  /**
   * The ID of the variant that this price applies to.
   */
  variant_id: string

  /**
   * The maximum quantity of the variant allowed in the cart for this price to be applied.
   */
  max_quantity?: number | null

  /**
   * The minimum quantity of the variant required in the cart for this price to be applied.
   */
  min_quantity?: number | null

  /**
   * Additional rules for the price list.
   */
  rules?: Record<string, string>
}

/**
 * The data to update a price list's price.
 */
export interface UpdatePriceListPriceWorkflowDTO {
  /**
   * The ID of the price.
   */
  id: string

  /**
   * The ID of the product variant that this price belongs to.
   */
  variant_id: string

  /**
   * The amount of the price.
   */
  amount?: number

  /**
   * The currency code of the price.
   * 
   * @example
   * usd
   */
  currency_code?: string

  /**
   * The maximum quantity of the variant allowed in the cart for this price to be applied.
   */
  max_quantity?: number | null

  /**
   * The minimum quantity of the variant required in the cart for this price to be applied.
   */
  min_quantity?: number | null

  /**
   * Additional rules for the price.
   */
  rules?: Record<string, string>
}

/**
 * The data to create a price list.
 */
export interface CreatePriceListWorkflowInputDTO {
  /**
   * The title of the price list.
   */
  title: string

  /**
   * The description of the price list.
   */
  description: string

  /**
   * The start date and time of the price list.
   */
  starts_at?: string | null

  /**
   * The end date and time of the price list.
   */
  ends_at?: string | null

  /**
   * The status of the price list.
   */
  status?: PriceListStatus

  /**
   * The rules associated with the price list.
   */
  rules?: Record<string, string[]>

  /**
   * The prices associated with the price list.
   */
  prices?: CreatePriceListPriceWorkflowDTO[]

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to update in a price list.
 */
export interface UpdatePriceListWorkflowInputDTO {
  /**
   * The ID of the price list to update.
   */
  id: string

  /**
   * The title of the price list.
   */
  title?: string

  /**
   * The description of the price list.
   */
  description?: string | null

  /**
   * The start date of the price list.
   */
  starts_at?: string | null

  /**
   * The end date of the price list.
   */
  ends_at?: string | null

  /**
   * The status of the price list.
   */
  status?: PriceListStatus

  /**
   * The rules associated with the price list.
   */
  rules?: Record<string, string[]>

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to update the prices of a price list.
 */
export interface UpdatePriceListPricesWorkflowDTO {
  /**
   * The ID of the price list.
   */
  id: string
  /**
   * The prices to update.
   */
  prices: UpdatePriceListPriceWorkflowDTO[]
}

/**
 * The data to manage the prices of a price list.
 */
export interface BatchPriceListPricesWorkflowDTO {
  /**
   * The ID of the price list.
   */
  id: string
  /**
   * The prices to create.
   */
  create: CreatePriceListPriceWorkflowDTO[]
  /**
   * The prices to update.
   */
  update: UpdatePriceListPriceWorkflowDTO[]
  /**
   * The IDs of prices to delete.
   */
  delete: string[]
}

/**
 * The result of managing a price list's prices.
 */
export interface BatchPriceListPricesWorkflowResult {
  /**
   * The prices that were created.
   */
  created: PricingTypes.PriceDTO[]
  /**
   * The prices that were updated.
   */
  updated: PricingTypes.PriceDTO[]
  /**
   * The IDs of the prices that were deleted.
   */
  deleted: string[]
}

/**
 * The data to create prices for a price list.
 */
export interface CreatePriceListPricesWorkflowDTO {
  /**
   * The ID of the price list.
   */
  id: string
  /**
   * The prices to create in the price list.
   */
  prices: CreatePriceListPriceWorkflowDTO[]
}

/**
 * The data to update the prices of a price list.
 */
export interface UpdatePriceListPriceWorkflowStepDTO {
  /**
   * The price list and its prices to update.
   */
  data?: UpdatePriceListPricesWorkflowDTO[]
  /**
   * An object whose keys are variant IDs and values are price set IDs.
   */
  variant_price_map: Record<string, string>
}

/**
 * The data to create price lists.
 */
export interface CreatePriceListsWorkflowStepDTO {
  /**
   * The price lists to create.
   */
  data: CreatePriceListWorkflowInputDTO[]
  /**
   * An object whose keys are variant IDs and values are price set IDs.
   */
  variant_price_map: Record<string, string>
}

/**
 * The data to create prices for price lists.
 */
export interface CreatePriceListPricesWorkflowStepDTO {
  /**
   * The prices to create.
   */
  data: (Pick<CreatePriceListWorkflowInputDTO, "prices"> & { id: string })[]
  /**
   * An object whose keys are variant IDs and values are price set IDs.
   */
  variant_price_map: Record<string, string>
}
