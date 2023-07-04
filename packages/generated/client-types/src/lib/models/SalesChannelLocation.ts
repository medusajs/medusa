/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { SalesChannel } from "./SalesChannel"

/**
 * Sales Channel Stock Location link sales channels with stock locations.
 */
export interface SalesChannelLocation {
  /**
   * The Sales Channel Stock Location's ID
   */
  id: string
  /**
   * The id of the Sales Channel
   */
  sales_channel_id: string
  /**
   * The id of the Location Stock.
   */
  location_id: string
  /**
   * The sales channel the location is associated with. Available if the relation `sales_channel` is expanded.
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
