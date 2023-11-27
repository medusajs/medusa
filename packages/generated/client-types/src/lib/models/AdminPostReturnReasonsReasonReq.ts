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
   * A unique value of the return reason.
   */
  value?: string
  /**
   * The description of the Reason.
   */
  description?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
