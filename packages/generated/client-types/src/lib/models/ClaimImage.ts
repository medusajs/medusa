/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ClaimItem } from "./ClaimItem"

/**
 * Represents photo documentation of a claim.
 */
export interface ClaimImage {
  /**
   * The claim image's ID
   */
  id: string
  /**
   * The ID of the claim item associated with the image
   */
  claim_item_id: string
  /**
   * A claim item object. Available if the relation `claim_item` is expanded.
   */
  claim_item?: ClaimItem | null
  /**
   * The URL of the image
   */
  url: string
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
