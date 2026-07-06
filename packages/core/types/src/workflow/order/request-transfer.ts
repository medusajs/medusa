/**
 * The input to the request order transfer workflow.
 */
export interface RequestOrderTransferWorkflowInput {
  /**
   * The ID of the order to transfer.
   */
  order_id: string
  /**
   * The ID of the customer to transfer the order to.
   */
  customer_id: string
  /**
   * The ID of the logged in user requesting the transfer.
   * Can be an admin user or a customer.
   */
  logged_in_user: string

  /**
   * Details of the transfer request.
   */
  description?: string
  /**
   * A note viewed by admin users only.
   */
  internal_note?: string
  /**
   * Whether to update the order.email to the transferred customer email.
   *
   * @since 2.13.7
   */
  update_order_email?: boolean
}
