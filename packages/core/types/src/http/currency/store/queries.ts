import { BaseFilterable } from "../../../dal"
import { FindParams } from "../../common"

export interface StoreGetCurrencyListParams
  extends FindParams,
    BaseFilterable<StoreGetCurrencyListParams> {
  q?: string
  code?: string | string[]
}
