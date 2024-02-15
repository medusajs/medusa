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
