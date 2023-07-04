/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Holds mapping between Publishable API keys and Sales Channels
 */
export interface PublishableApiKeySalesChannel {
  /**
   * The sales channel's ID
   */
  sales_channel_id: string
  /**
   * The publishable API key's ID
   */
  publishable_key_id: string
}
