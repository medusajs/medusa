/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ReturnReason } from "./ReturnReason"

export interface AdminReturnReasonsRes {
  return_reason: SetRelation<
    ReturnReason,
    "parent_return_reason" | "return_reason_children"
  >
}
