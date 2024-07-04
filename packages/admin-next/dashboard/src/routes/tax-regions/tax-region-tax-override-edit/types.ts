import { RuleReferenceType } from "../common/constants"
import { TaxRateRuleValue } from "../common/schemas"

export type InitialRuleValues = {
  [RuleReferenceType.PRODUCT]: TaxRateRuleValue[]
  [RuleReferenceType.PRODUCT_COLLECTION]: TaxRateRuleValue[]
  [RuleReferenceType.PRODUCT_TAG]: TaxRateRuleValue[]
  [RuleReferenceType.PRODUCT_TYPE]: TaxRateRuleValue[]
  [RuleReferenceType.CUSTOMER_GROUP]: TaxRateRuleValue[]
}
