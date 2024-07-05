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
 * The order change's status.
 */
export enum OrderChangeStatus {
  /**
   * The order change is confirmed.
   */
  CONFIRMED = "confirmed",
  /**
   * The order change is declined.
   */
  DECLINED = "declined",
  /**
   * The order change is requested.
   */
  REQUESTED = "requested",
  /**
   * The order change is pending.
   */
  PENDING = "pending",
  /**
   * The order change is canceled.
   */
  CANCELED = "canceled",
}
