import { BaseFilterable, OperatorMap } from "../../../dal"
import { PriceListStatus } from "../../../pricing"
import { FindParams, SelectParams } from "../../common"

export interface AdminPriceListListParams
  extends FindParams,
    BaseFilterable<AdminPriceListListParams> {
  q?: string
  id?: string | string[]
  starts_at?: OperatorMap<string>
  ends_at?: OperatorMap<string>
  status?: PriceListStatus[]
  rules_count?: number[]
}

export interface AdminPriceListParams extends SelectParams {}
