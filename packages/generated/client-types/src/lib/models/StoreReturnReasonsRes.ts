/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ReturnReason } from "./ReturnReason"

/**
 * The return reason's details.
 */
export interface StoreReturnReasonsRes {
  /**
   * Return reason details.
   */
  return_reason: SetRelation<
    ReturnReason,
    "parent_return_reason" | "return_reason_children"
  >
}
