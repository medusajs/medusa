/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"

/**
 * This represents the association between a sales channel and a stock locations.
 */
export interface SalesChannelLocation {
  /**
   * The Sales Channel Stock Location's ID
   */
  id: string
  /**
   * The ID of the Sales Channel
   */
  sales_channel_id: string
  /**
   * The ID of the Location Stock.
   */
  location_id: string
  /**
   * The details of the sales channel the location is associated with.
   */
  sales_channel?: SalesChannel | null
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
