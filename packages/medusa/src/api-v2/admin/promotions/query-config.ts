export const defaultAdminPromotionFields = [
  "id",
  "code",
  "is_automatic",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
  "*campaign",
  "*campaign.budget",
  "*application_method",
  "*application_method.buy_rules",
  "application_method.buy_rules.values.value",
  "*application_method.target_rules",
  "application_method.target_rules.values.value",
  "rules.id",
  "rules.attribute",
  "rules.operator",
  "rules.values.value",
]

export const defaultAdminPromotionRuleFields = [
  "id",
  "description",
  "attribute",
  "operator",
  "values.value",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminPromotionFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}

export const retrieveRuleTransformQueryConfig = {
  defaults: defaultAdminPromotionRuleFields,
  isList: false,
}

export const listRuleTransformQueryConfig = {
  ...retrieveRuleTransformQueryConfig,
  isList: true,
}

export const listRuleValueTransformQueryConfig = {
  defaults: [],
  allowed: [],
  isList: true,
}
