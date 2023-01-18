/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Claim Tags are user defined tags that can be assigned to claim items for easy filtering and grouping.
 */
export type ClaimTag = {
  /**
   * The claim tag's ID
   */
  id?: string;
  /**
   * The value that the claim tag holds
   */
  value: string;
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

