const defaultStoreProductRemoteQueryObject = {
  fields: [
    "id",
    "title",
    "subtitle",
    "status",
    "external_id",
    "description",
    "handle",
    "is_giftcard",
    "discountable",
    "thumbnail",
    "collection_id",
    "type_id",
    "weight",
    "length",
    "height",
    "width",
    "hs_code",
    "origin_country",
    "mid_code",
    "material",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
  ],
  images: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "url", "metadata"],
  },
  tags: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
  },

  type: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
  },

  collection: {
    fields: ["title", "handle", "id", "created_at", "updated_at", "deleted_at"],
  },

  options: {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "title",
      "product_id",
      "metadata",
    ],
    values: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "value",
        "option_id",
        "variant_id",
        "metadata",
      ],
    },
  },

  variants: {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "title",
      "product_id",
      "sku",
      "barcode",
      "ean",
      "upc",
      "variant_rank",
      "inventory_quantity",
      "allow_backorder",
      "manage_inventory",
      "hs_code",
      "origin_country",
      "mid_code",
      "material",
      "weight",
      "length",
      "height",
      "width",
      "metadata",
    ],

    options: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "value",
        "option_id",
        "variant_id",
        "metadata",
      ],
    },
  },
  profile: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "name", "type"],
  },
}

function fromObjectToStringPath(fields, parent) {
  return Object.keys(fields).reduce((acc, key) => {
    if (key === "fields") {
      if (parent) {
        fields[key].map((fieldKey) => acc.push(`${parent}.${fieldKey}`))
      } else {
        fields[key].map((fieldKey) => acc.push(fieldKey))
      }

      return acc
    }

    if (typeof fields[key] === "object") {
      acc = acc.concat(
        fromObjectToStringPath(fields[key], parent ? `${parent}.${key}` : key)
      )
      return acc
    }

    return acc
  }, [] as string[])
}
