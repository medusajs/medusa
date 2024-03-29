/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

/**
 * The details of the draft order to update.
 */
export interface AdminPostDraftOrdersDraftOrderReq {
  /**
   * The ID of the Region to create the Draft Order in.
   */
  region_id?: string
  /**
   * The 2 character ISO code for the Country.
   */
  country_code?: string
  /**
   * An email to be used in the Draft Order.
   */
  email?: string
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: AddressPayload | string
  /**
   * The Address to be used for shipping purposes.
   */
  shipping_address?: AddressPayload | string
  /**
   * An array of Discount codes to add to the Draft Order.
   */
  discounts?: Array<{
    /**
     * The code that a Discount is identifed by.
     */
    code: string
  }>
  /**
   * An optional flag passed to the resulting order that indicates whether the customer should receive notifications about order updates.
   */
  no_notification_order?: boolean
  /**
   * The ID of the customer this draft order is associated with.
   */
  customer_id?: string
}
