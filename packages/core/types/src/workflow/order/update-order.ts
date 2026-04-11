import { UpsertOrderAddressDTO } from "../../order"

/**
 * The data to update an order's details.
 */
export type UpdateOrderWorkflowInput = {
  /**
   * The ID of the order to update.
   */
  id: string
  /**
   * The ID of the user updating the order.
   */
  user_id: string
  /**
   * Create or update the shipping address of the order.
   * Changing the country code will throw an error.
   */
  shipping_address?: UpsertOrderAddressDTO
  /**
   * Create or update the billing address of the order.
   * Changing the country code will throw an error.
   */
  billing_address?: UpsertOrderAddressDTO
  /**
   * The new email of the order.
   */
  email?: string
  /**
   * The new locale of the order. When changed, all line items
   * will be re-translated to the new locale.
   */
  locale?: string | null
  /**
   * The new metadata of the order.
   */
  metadata?: Record<string, unknown> | null
}

export type UpdateOrderShippingAddressWorkflowInput = {
  order_id: string
  shipping_address: UpsertOrderAddressDTO
  description?: string
  internal_note?: string
}
