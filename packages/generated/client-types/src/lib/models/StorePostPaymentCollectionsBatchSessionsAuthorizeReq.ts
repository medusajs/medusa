/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostPaymentCollectionsBatchSessionsAuthorizeReq {
  /**
   * List of Payment Session IDs to authorize.
   */
  session_ids: Array<string>
}
