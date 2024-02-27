export const defaultAdminCampaignRelations = ["budget"]
export const allowedAdminCampaignRelations = [
  ...defaultAdminCampaignRelations,
  "promotions",
]
export const defaultAdminCampaignFields = [
  "name",
  "description",
  "currency",
  "campaign_identifier",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminCampaignFields,
  defaultRelations: defaultAdminCampaignRelations,
  allowedRelations: allowedAdminCampaignRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
