export enum Entities {
  campaign = "campaign",
}

export const defaultAdminCampaignFields = [
  "id",
  "name",
  "description",
  "currency",
  "campaign_identifier",
  "*budget",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCampaignFields,
  isList: false,
  entity: Entities.campaign,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.campaign,
}
