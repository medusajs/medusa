import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface StoreGetCurrencyListParams
  extends FindParams,
    BaseFilterable<StoreGetCurrencyListParams> {
  q?: string
  code?: string | string[]
}

export interface StoreGetCurrencyParams extends SelectParams {}
