/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Reason for why a given product is returned. A Return Reason can be used on Return Items in order to indicate why a Line Item was returned.
 */
export type ReturnReason = {
  /**
   * The cart's ID
   */
  id?: string;
  /**
   * A description of the Reason.
   */
  description?: string;
  /**
   * A text that can be displayed to the Customer as a reason.
   */
  label: string;
  /**
   * The value to identify the reason by.
   */
  value: string;
  /**
   * The ID of the parent reason.
   */
  parent_return_reason_id?: string;
  /**
   * Available if the relation `parent_return_reason` is expanded.
   */
  parent_return_reason?: ReturnReason;
  /**
   * Available if the relation `return_reason_children` is expanded.
   */
  return_reason_children?: ReturnReason;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string;
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>;
};

