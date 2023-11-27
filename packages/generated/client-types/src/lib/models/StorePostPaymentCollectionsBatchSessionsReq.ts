/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostPaymentCollectionsBatchSessionsReq {
  /**
   * Payment sessions related to the Payment Collection. Existing sessions that are not added in this array will be deleted.
   */
  sessions: Array<{
    /**
     * The ID of the Payment Provider.
     */
    provider_id: string
    /**
     * The payment amount
     */
    amount: number
    /**
     * The ID of the Payment Session to be updated. If no ID is provided, a new payment session is created.
     */
    session_id?: string
  }>
}
