export const defaultStoreCartFields = [
  "id",
  "currency_code",
  "email",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultStoreCartRelations = [
  "items",
  "region",
  "shipping_address",
  "billing_address",
  "shipping_methods",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultStoreCartFields,
  defaultRelations: defaultStoreCartRelations,
  isList: false,
}

export const defaultStoreCartRemoteQueryObject = {
  fields: defaultStoreCartFields,
  items: {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "title",
      "quantity",
      "unit_price",
    ],
  },
  shipping_address: {
    fields: [
      "id",
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "city",
      "postal_code",
      "country_code",
      "region_code",
      "phone",
    ],
  },
  billing_address: {
    fields: [
      "id",
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "city",
      "postal_code",
      "country_code",
      "region_code",
      "phone",
    ],
  },
  region: {
    fields: ["id", "name", "currency_code"],
  },
}
