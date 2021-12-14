import { DateComparisonOperator } from "./common"

export class FilterableProductTaxRateProps {
  product_id?: string | string[]
  rate_id?: string | string[]
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
}
