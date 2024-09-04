import { TaxRateRuleReferenceType } from "../common/constants"
import { TaxRateRuleReference } from "../common/schemas"

export type InitialRuleValues = {
  [TaxRateRuleReferenceType.PRODUCT]: TaxRateRuleReference[]
  [TaxRateRuleReferenceType.PRODUCT_COLLECTION]: TaxRateRuleReference[]
  [TaxRateRuleReferenceType.PRODUCT_TAG]: TaxRateRuleReference[]
  [TaxRateRuleReferenceType.PRODUCT_TYPE]: TaxRateRuleReference[]
  [TaxRateRuleReferenceType.CUSTOMER_GROUP]: TaxRateRuleReference[]
}
