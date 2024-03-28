import { defaultAdminSalesChannelFields } from "../sales-channels/query-config"

export const defaultAdminStockLocationFields = [
  "id",
  "name",
  "metadata",
  "created_at",
  "updated_at",
  "address.id",
  "address.address_1",
  "address.address_2",
  "address.city",
  "address.country_code",
  "address.phone",
  "address.province",
  "address.postal_code",
  "address.metadata",
]

const allowedFields = [
  ...defaultAdminStockLocationFields,
  "sales_channel.id",
  "sales_channel.name",
  "sales_channel.description",
  "sales_channel.is_disabled",
  "sales_channel.created_at",
  "sales_channel.updated_at",
  "sales_channel.deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminStockLocationFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
