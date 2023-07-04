import { DateComparisonOperator } from "./common"

/**
 * The filters that can be applied when querying for shipping tax rates.
 */
export class FilterableProductTaxRateProps {
  product_id?: string | string[]
  rate_id?: string | string[]
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
}
