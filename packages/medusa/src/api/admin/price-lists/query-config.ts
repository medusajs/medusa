export enum Entities {
  price_list = "price_list",
  price = "price",
}

// Note: renamed to avoid referencing remoteQuery which is legacy
export const adminPriceListPriceQueryFields = [
  "id",
  "currency_code",
  "amount",
  "min_quantity",
  "max_quantity",
  "created_at",
  "deleted_at",
  "updated_at",
  "price_set.variant.id",
  "price_rules.value",
  "price_rules.attribute",
]

export const adminPriceListRemoteQueryFields = [
  "id",
  "type",
  "description",
  "title",
  "status",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "price_list_rules.value",
  "price_list_rules.attribute",
  "prices.id",
  "prices.currency_code",
  "prices.amount",
  "prices.min_quantity",
  "prices.max_quantity",
  "prices.price_set_id",
  "prices.price_list_id",
  "prices.raw_amount",
  "prices.raw_min_quantity",
  "prices.raw_max_quantity",
  "prices.created_at",
  "prices.updated_at",
  "prices.deleted_at",
  "prices.rules_count",
  "prices.title",
  "prices.price_set.variant.id",
  "prices.price_rules.value",
  "prices.price_rules.attribute",
]

export const retrivePriceListPriceQueryConfig = {
  defaults: adminPriceListPriceQueryFields,
  isList: false,
  entity: Entities.price_list,
}

export const listPriceListPriceQueryConfig = {
  ...retrivePriceListPriceQueryConfig,
  isList: true,
  entity: Entities.price_list,
}

export const retrivePriceListQueryConfig = {
  defaults: adminPriceListRemoteQueryFields,
  isList: false,
  entity: Entities.price_list,
}

export const listPriceListQueryConfig = {
  ...retrivePriceListQueryConfig,
  isList: true,
  entity: Entities.price_list,
}
