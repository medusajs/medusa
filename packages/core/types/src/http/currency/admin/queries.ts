import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminCurrencyParams extends SelectParams {}

export interface AdminCurrencyListParams
  extends FindParams,
    BaseFilterable<AdminCurrencyListParams> {
  q?: string
  code?: string | string[]
}
