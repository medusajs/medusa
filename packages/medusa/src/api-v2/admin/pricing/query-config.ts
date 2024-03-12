export const defaultAdminPricingRuleTypeRelations = []
export const allowedAdminPricingRuleTypeRelations = []
export const defaultAdminPricingRuleTypeFields = [
  "id",
  "name",
  "rule_attribute",
  "default_priority",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminPricingRuleTypeFields,
  defaultRelations: defaultAdminPricingRuleTypeRelations,
  allowedRelations: allowedAdminPricingRuleTypeRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
