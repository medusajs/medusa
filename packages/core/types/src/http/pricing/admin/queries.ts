import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminPricePreferenceListParams
  extends FindParams,
    BaseFilterable<AdminPricePreferenceListParams> {
  id?: string | string[]
  attribute?: string | string[]
  value?: string | string[]
  q?: string
}

export interface AdminPricePreferenceParams extends SelectParams {}
