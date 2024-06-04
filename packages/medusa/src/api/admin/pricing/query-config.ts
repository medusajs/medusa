export const defaultAdminPricingRuleTypeFields = [
  "id",
  "name",
  "rule_attribute",
  "default_priority",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminPricingRuleTypeFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
