import { ModulesResponse as sdkModulesResponse } from "@medusajs/modules-sdk"
import { FulfillmentProvider, PaymentProvider, Store } from "../models"
import { FeatureFlagsResponse } from "./feature-flags"

export type UpdateStoreInput = {
  name?: string
  swap_link_template?: string
  payment_link_template?: string
  invite_link_template?: string
  default_currency_code?: string
  currencies?: string[]
  metadata?: Record<string, unknown>
  default_sales_channel_id?: string
}

/**
 * @schema ModulesResponse
 * type: array
 * items:
 *   type: object
 *   required:
 *     - module
 *     - resolution
 *   properties:
 *     module:
 *       description: The key of the module.
 *       type: string
 *     resolution:
 *       description: The resolution path of the module or false if module is not installed.
 *       type: string
 */
export type ModulesResponse = sdkModulesResponse

/**
 * @schema ExtendedStoreDTO
 * allOf:
 *   - $ref: "#/components/schemas/Store"
 *   - type: object
 *     required:
 *       - payment_providers
 *       - fulfillment_providers
 *       - feature_flags
 *       - modules
 *     properties:
 *       payment_providers:
 *         $ref: "#/components/schemas/PaymentProvider"
 *       fulfillment_providers:
 *         $ref: "#/components/schemas/FulfillmentProvider"
 *       feature_flags:
 *         $ref: "#/components/schemas/FeatureFlagsResponse"
 *       modules:
 *         $ref: "#/components/schemas/ModulesResponse"
 *
 */
export type ExtendedStoreDTO = Store & {
  payment_providers: PaymentProvider[]
  fulfillment_providers: FulfillmentProvider[]
  feature_flags: FeatureFlagsResponse
  modules: ModulesResponse
}
