import { FindParams, SelectParams } from "../../common"
import { BaseFilterable } from "../../../dal"

export interface AdminGetPricePreferenceParams extends SelectParams {}

export interface AdminPricePreferenceListParams
  extends FindParams,
    BaseFilterable<AdminPricePreferenceListParams> {
  value?: string | string[] | undefined
  q?: string | undefined
  id?: string | string[] | undefined
  attribute?: string | string[] | undefined
}
