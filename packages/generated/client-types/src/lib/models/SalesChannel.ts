/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannelLocation } from "./SalesChannelLocation"

/**
 * A Sales Channel is a method a business offers its products for purchase for the customers. For example, a Webshop can be a sales channel, and a mobile app can be another.
 */
export interface SalesChannel {
  /**
   * The sales channel's ID
   */
  id: string
  /**
   * The name of the sales channel.
   */
  name: string
  /**
   * The description of the sales channel.
   */
  description: string | null
  /**
   * Specify if the sales channel is enabled or disabled.
   */
  is_disabled: boolean
  /**
   * The details of the stock locations related to the sales channel.
   */
  locations?: Array<SalesChannelLocation>
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any> | null
}
