/**
 * The input to the transfer order to guest workflow.
 *
 * @since 2.18.0
 */
export interface TransferOrderToGuestWorkflowInput {
  /**
   * The ID of the order to transfer.
   */
  order_id: string
  /**
   * The email of the guest customer to transfer the order to.
   * If no customer exists with this email, a guest customer is created.
   */
  email: string
  /**
   * The ID of the logged in user requesting the transfer.
   */
  logged_in_user: string

  /**
   * Details of the transfer.
   */
  description?: string
  /**
   * A note viewed by admin users only.
   */
  internal_note?: string
}
