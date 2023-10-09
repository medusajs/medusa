/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimImage } from "./ClaimImage"
import type { ClaimOrder } from "./ClaimOrder"
import type { ClaimTag } from "./ClaimTag"
import type { LineItem } from "./LineItem"
import type { ProductVariant } from "./ProductVariant"

/**
 * A claim item is an item created as part of a claim. It references an item in the order that should be exchanged or refunded.
 */
export interface ClaimItem {
  /**
   * The claim item's ID
   */
  id: string
  /**
   * The claim images that are attached to the claim item.
   */
  images?: Array<ClaimImage>
  /**
   * The ID of the claim this item is associated with.
   */
  claim_order_id: string
  /**
   * The details of the claim this item belongs to.
   */
  claim_order?: ClaimOrder | null
  /**
   * The ID of the line item that the claim item refers to.
   */
  item_id: string
  /**
   * The details of the line item in the original order that this claim item refers to.
   */
  item?: LineItem | null
  /**
   * The ID of the product variant that is claimed.
   */
  variant_id: string
  /**
   * The details of the product variant to potentially replace the item in the original order.
   */
  variant?: ProductVariant | null
  /**
   * The reason for the claim
   */
  reason: "missing_item" | "wrong_item" | "production_failure" | "other"
  /**
   * An optional note about the claim, for additional information
   */
  note: string | null
  /**
   * The quantity of the item that is being claimed; must be less than or equal to the amount purchased in the original order.
   */
  quantity: number
  /**
   * User defined tags for easy filtering and grouping.
   */
  tags?: Array<ClaimTag>
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
  metadata: Record<string, any> | null
}
