/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ReturnReason } from "./ReturnReason"

/**
 * The list of return reasons.
 */
export interface StoreReturnReasonsListRes {
  /**
   * An array of return reasons details.
   */
  return_reasons: Array<
    SetRelation<ReturnReason, "parent_return_reason" | "return_reason_children">
  >
}
