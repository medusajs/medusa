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

export enum OrderChangeType {
  RETURN_REQUEST = "return_request",
  RETURN_RECEIVE = "return_receive",
  EXCHANGE = "exchange",
  CLAIM = "claim",
  EDIT = "edit",
}
