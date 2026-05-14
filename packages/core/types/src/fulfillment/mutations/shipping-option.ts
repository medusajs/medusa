import { CreateShippingOptionTypeDTO } from "./shipping-option-type"
import { CartPropsForFulfillment, ShippingOptionPriceType } from "../common"
import { CreateShippingOptionRuleDTO } from "./shipping-option-rule"
import { StockLocationDTO } from "../../stock-location"

/**
 * The shipping option to be created.
 */
export interface CreateShippingOptionDTO {
  /**
   * The name of the shipping option.
   */
  name: string

  /**
   * The type of the shipping option's price.
   */
  price_type: ShippingOptionPriceType

  /**
   * The associated service zone's ID.
   */
  service_zone_id: string

  /**
   * The associated shipping profile's ID.
   */
  shipping_profile_id: string

  /**
   * The associated provider's ID.
   */
  provider_id: string

  /**
   * The shipping option type associated with the shipping option.
   */
  type: CreateShippingOptionTypeDTO | string

  /**
   * The data necessary for the associated fulfillment provider to process the shipping option
   * and its associated fulfillments.
   */
  data?: Record<string, unknown> | null

  /**
   * The shipping option rules associated with the shipping option.
   */
  rules?: Omit<CreateShippingOptionRuleDTO, "shipping_option_id">[]
}

/**
 * The attributes to update in the shipping option.
 */
export interface UpdateShippingOptionDTO {
  /**
   * The ID of the shipping option.
   */
  id?: string

  /**
   * The name of the shipping option.
   */
  name?: string

  /**
   * The type of the shipping option's price.
   */
  price_type?: ShippingOptionPriceType

  /**
   * The associated service zone's ID.
   */
  service_zone_id?: string

  /**
   * The associated shipping profile's ID.
   */
  shipping_profile_id?: string

  /**
   * The associated provider's ID.
   */
  provider_id?: string

  /**
   * The ID of the shipping option type.
   */
  shipping_option_type_id?: string

  /**
   * The ID of the type of shipping option.
   * Column doesn't exist on the entity -> normalized to `shipping_option_type_id`
   */
  type_id?: string

  /**
   * The shipping option type associated with the shipping option.
   */
  type?:
    | CreateShippingOptionTypeDTO
    | string
    | {
        /**
         * The ID of the shipping option type.
         */
        id: string
      }

  /**
   * The data necessary for the associated fulfillment provider to process the shipping option
   * and its associated fulfillments.
   */
  data?: Record<string, unknown> | null

  /**
   * The shipping option rules associated with the shipping option.
   */
  rules?: (
    | Omit<CreateShippingOptionRuleDTO, "shipping_option_id">
    | {
        /**
         * The ID of the shipping option rule.
         */
        id: string
      }
  )[]
}

/**
 * A shipping option to be created or updated.
 */
export interface UpsertShippingOptionDTO extends UpdateShippingOptionDTO {}

type CalculateShippingItems = {
  /**
   * The ID of the order item. Lookup in context.items for the details about variant / product.
   */
  id: string
  /**
   * The quantity to ship.
   */
  quantity: number
}

export type CalculatedRMAShippingContext =
  | {
      /**
       * The ID of the return.
       */
      return_id: string
      /**
       * The details of the return's items.
       */
      return_items: CalculateShippingItems[]
    }
  | {
      /**
       * The ID of the exchange.
       */
      exchange_id: string
      /**
       * The details of the exchange's items.
       */
      exchange_items: CalculateShippingItems[]
    }
  | {
      /**
       * The ID of the claim.
       */
      claim_id: string
      /**
       * The details of the claim's items.
       */
      claim_items: CalculateShippingItems[]
    }

/**
 * The data needed for the associated fulfillment provider to calculate the price of a shipping option.
 */
export interface CalculateShippingOptionPriceDTO {
  /**
   * The ID of the shipping option.
   */
  id: string

  /**
   * The ID of the fulfillment provider.
   */
  provider_id: string

  /**
   * The `data` property of the shipping option.
   */
  optionData: Record<string, unknown>

  /**
   * The shipping method's `data` property with custom data passed from the frontend.
   */
  data: Record<string, unknown>

  /**
   * The calculation context needed for the associated fulfillment provider to calculate the price of a shipping option.
   */
  context: CartPropsForFulfillment & {
    /**
     * The location that the items will be shipped from (or to if it is a return).
     */
    from_location?: StockLocationDTO

    [k: string]: unknown
  } & CalculatedRMAShippingContext
}

/**
 * The calculation context needed for the associated fulfillment provider to calculate the price of a shipping option.
 */
export type CalculateShippingOptionPriceContext =
  CalculateShippingOptionPriceDTO["context"]
