/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminUpdatePaymentCollectionsReq {
  /**
   * An optional description to create or update the payment collection.
   */
  description?: string
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
