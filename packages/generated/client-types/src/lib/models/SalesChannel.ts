/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannelLocation } from "./SalesChannelLocation"

/**
 * A Sales Channel
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
   * The Stock Locations related to the sales channel. Available if the relation `locations` is expanded.
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
}
