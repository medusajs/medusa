export enum Entities {
  fulfillment_set = "fulfillment_set",
  service_zone = "service_zone",
}

export const defaultAdminFulfillmentSetsFields = [
  "id",
  "name",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
  "*service_zones",
  "*service_zones.geo_zones",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFulfillmentSetsFields,
  isList: false,
  entity: Entities.fulfillment_set,
}

export const retrieveServiceZoneTransformQueryConfig = {
  defaults: [
    "id",
    "name",
    "type",
    "created_at",
    "updated_at",
    "deleted_at",
    "*geo_zones",
  ],
  isList: false,
  entity: Entities.fulfillment_set,
}
