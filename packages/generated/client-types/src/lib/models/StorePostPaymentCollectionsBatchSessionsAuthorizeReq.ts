/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the payment sessions to authorize.
 */
export interface StorePostPaymentCollectionsBatchSessionsAuthorizeReq {
  /**
   * List of Payment Session IDs to authorize.
   */
  session_ids: Array<string>
}
