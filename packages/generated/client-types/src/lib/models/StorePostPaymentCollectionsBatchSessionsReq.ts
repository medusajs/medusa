/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostPaymentCollectionsBatchSessionsReq {
  /**
   * An array of payment sessions related to the Payment Collection. If the session_id is not provided, existing sessions not present will be deleted and the provided ones will be created.
   */
  sessions: Array<{
    /**
     * The ID of the Payment Provider.
     */
    provider_id: string
    /**
     * The amount .
     */
    amount: number
    /**
     * The ID of the Payment Session to be updated.
     */
    session_id?: string
  }>
}
