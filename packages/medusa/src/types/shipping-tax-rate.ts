import { DateComparisonOperator } from "./common"

/**
 * The filters that can be applied when querying for shipping tax rates.
 */
export class FilterableShippingTaxRateProps {
  shipping_option_id?: string | string[]
  rate_id?: string | string[]
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
}
