export const defaultAdminPromotionRelations = [
  "campaign",
  "rules",
  "rules.values",
  "application_method",
  "application_method.buy_rules",
  "application_method.buy_rules.values",
  "application_method.target_rules",
  "application_method.target_rules.values",
]
export const allowedAdminPromotionRelations = [
  ...defaultAdminPromotionRelations,
]
export const defaultAdminPromotionFields = [
  "id",
  "code",
  "campaign",
  "is_automatic",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
  "application_method.buy_rules.attribute",
  "application_method.buy_rules.operator",
  "application_method.buy_rules.values.value",
  "application_method.target_rules.attribute",
  "application_method.target_rules.operator",
  "application_method.target_rules.values.value",
  "rules.attribute",
  "rules.operator",
  "rules.values.value",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminPromotionFields,
  defaultRelations: defaultAdminPromotionRelations,
  allowedRelations: allowedAdminPromotionRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
