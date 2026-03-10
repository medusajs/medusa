export enum Entities {
  reservation_item = "reservation_item",
}

import { defaultAdminInventoryItemFields } from "../inventory-items/query-config"

export const defaultAdminReservationFields = [
  "id",
  "location_id",
  "inventory_item_id",
  "quantity",
  "line_item_id",
  "description",
  "metadata",
  "created_at",
  "updated_at",
  ...defaultAdminInventoryItemFields.map((f) => `inventory_item.${f}`),
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminReservationFields,
  isList: false,
  entity: Entities.reservation_item,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.reservation_item,
}
