/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents photo documentation of a claim.
 */
export type ClaimImage = {
  /**
   * The claim image's ID
   */
  id?: string;
  /**
   * The ID of the claim item associated with the image
   */
  claim_item_id: string;
  /**
   * A claim item object. Available if the relation `claim_item` is expanded.
   */
  claim_item?: Record<string, any>;
  /**
   * The URL of the image
   */
  url: string;
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

