import {
  DateComparisonOperator,
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "./common"

export type FilterableTaxRateProps = {
  region_id?: string | string[]
  code?: string | string[] | StringComparisonOperator
  name?: string | string[]
  rate?: number | NumericalComparisonOperator
  created_at?: Date | DateComparisonOperator
  updated_at?: Date | DateComparisonOperator
  deleted_at?: Date | DateComparisonOperator
  q?: string
}

export type UpdateTaxRateInput = {
  region_id?: string
  code?: string
  name?: string
  rate?: number | null
}

export type CreateTaxRateInput = {
  region_id: string
  code: string
  name: string
  rate?: number | null
}

export type TaxRateListByConfig = {
  region_id?: string
}
