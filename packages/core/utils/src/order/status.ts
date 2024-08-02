/**
 * @enum
 *
 * The order's status.
 */
export enum OrderStatus {
  /**
   * The order is pending.
   */
  PENDING = "pending",
  /**
   * The order is completed
   */
  COMPLETED = "completed",
  /**
   * The order is a draft.
   */
  DRAFT = "draft",
  /**
   * The order is archived.
   */
  ARCHIVED = "archived",
  /**
   * The order is canceled.
   */
  CANCELED = "canceled",
  /**
   * The order requires action.
   */
  REQUIRES_ACTION = "requires_action",
}

/**
 * @enum
 *
 * The return's status.
 */
export enum ReturnStatus {
  /**
   * The return is open.
   */
  OPEN = "open",
  /**
   * The return is requested.
   */
  REQUESTED = "requested",
  /**
   * The return is received.
   */
  RECEIVED = "received",
  /**
   * The return is partially received.
   */
  PARTIALLY_RECEIVED = "partially_received",
  /**
   * The return is canceled.
   */
  CANCELED = "canceled",
}

/**
 * @enum
 *
 * The claim's type.
 */
export enum ClaimType {
  /**
   * The claim refunds an amount to the customer.
   */
  REFUND = "refund",
  /**
   * The claim replaces the returned item with a new one.
   */
  REPLACE = "replace",
}

/**
 * @enum
 *
 * The claim's item reason.
 */
export enum ClaimReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}
