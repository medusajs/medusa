/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Fulfillment } from "./Fulfillment"
import type { LineItem } from "./LineItem"

/**
 * This represents the association between a Line Item and a Fulfillment.
 */
export interface FulfillmentItem {
  /**
   * The ID of the Fulfillment that the Fulfillment Item belongs to.
   */
  fulfillment_id: string
  /**
   * The ID of the Line Item that the Fulfillment Item references.
   */
  item_id: string
  /**
   * The details of the fulfillment.
   */
  fulfillment?: Fulfillment | null
  /**
   * The details of the line item.
   */
  item?: LineItem | null
  /**
   * The quantity of the Line Item that is included in the Fulfillment.
   */
  quantity: number
}
