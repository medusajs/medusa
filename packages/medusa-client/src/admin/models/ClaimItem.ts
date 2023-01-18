/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClaimImage } from './ClaimImage';
import type { ClaimTag } from './ClaimTag';
import type { LineItem } from './LineItem';

/**
 * Represents a claimed item along with information about the reasons for the claim.
 */
export type ClaimItem = {
  /**
   * The claim item's ID
   */
  id?: string;
  /**
   * Available if the relation `images` is expanded.
   */
  images?: Array<ClaimImage>;
  /**
   * The ID of the claim this item is associated with.
   */
  claim_order_id: string;
  /**
   * A claim order object. Available if the relation `claim_order` is expanded.
   */
  claim_order?: Record<string, any>;
  /**
   * The ID of the line item that the claim item refers to.
   */
  item_id: string;
  /**
   * Available if the relation `item` is expanded.
   */
  item?: LineItem;
  /**
   * The ID of the product variant that is claimed.
   */
  variant_id: string;
  /**
   * A variant object. Available if the relation `variant` is expanded.
   */
  variant?: Record<string, any>;
  /**
   * The reason for the claim
   */
  reason: 'missing_item' | 'wrong_item' | 'production_failure' | 'other';
  /**
   * An optional note about the claim, for additional information
   */
  note?: string;
  /**
   * The quantity of the item that is being claimed; must be less than or equal to the amount purchased in the original order.
   */
  quantity: number;
  /**
   * User defined tags for easy filtering and grouping. Available if the relation 'tags' is expanded.
   */
  tags?: Array<ClaimTag>;
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

