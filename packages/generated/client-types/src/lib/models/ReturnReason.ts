/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * A Reason for why a given product is returned. A Return Reason can be used on Return Items in order to indicate why a Line Item was returned.
 */
export interface ReturnReason {
  /**
   * The return reason's ID
   */
  id: string
  /**
   * The value to identify the reason by.
   */
  value: string
  /**
   * A text that can be displayed to the Customer as a reason.
   */
  label: string
  /**
   * A description of the Reason.
   */
  description: string | null
  /**
   * The ID of the parent reason.
   */
  parent_return_reason_id: string | null
  /**
   * Available if the relation `parent_return_reason` is expanded.
   */
  parent_return_reason?: ReturnReason | null
  /**
   * Available if the relation `return_reason_children` is expanded.
   */
  return_reason_children?: ReturnReason
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
