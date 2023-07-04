/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostReturnReasonsReasonReq {
  /**
   * The label to display to the Customer.
   */
  label?: string
  /**
   * The value that the Return Reason will be identified by. Must be unique.
   */
  value?: string
  /**
   * An optional description to for the Reason.
   */
  description?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
