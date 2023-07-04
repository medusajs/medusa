/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ReturnReason } from "./ReturnReason"

export interface StoreReturnReasonsListRes {
  return_reasons: Array<
    SetRelation<ReturnReason, "parent_return_reason" | "return_reason_children">
  >
}
