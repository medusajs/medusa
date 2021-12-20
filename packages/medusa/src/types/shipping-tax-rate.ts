import { DateComparisonOperator } from "./common"

export class FilterableShippingTaxRateProps {
  shipping_option_id?: string | string[]
  rate_id?: string | string[]
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
}
