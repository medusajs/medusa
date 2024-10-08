import { PaginatedResponse } from "../../common"
import { StoreReturnReason } from "./entities"

export interface StoreReturnReasonResponse {
  return_reason: StoreReturnReason
}

export type StoreReturnReasonListResponse = PaginatedResponse<{
  return_reasons: StoreReturnReason[]
}>
