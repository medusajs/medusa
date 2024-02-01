import { MedusaContainer } from "@medusajs/types"
import { MedusaV2Flag, promiseAll } from "@medusajs/utils"

import { PriceListService } from "../../../services"
import { getVariantsFromPriceList } from "./get-variants-from-price-list"

export async function listProducts(
  container: MedusaContainer,
  filterableFields,
  listConfig
) {
  // TODO: Add support for fields/expands

  const remoteQuery = container.resolve("remoteQuery")
  const featureFlagRouter = container.resolve("featureFlagRouter")

  const productIdsFilter: Set<string> = new Set()
  const variantIdsFilter: Set<string> = new Set()

  const promises: Promise<void>[] = []

  // This is not the best way of handling cross filtering but for now I would say it is fine
  const salesChannelIdFilter = filterableFields.sales_channel_id
  delete filterableFields.sales_channel_id

  const priceListId = filterableFields.price_list_id
  delete filterableFields.price_list_id

  if (priceListId) {
    if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
      const variants = await getVariantsFromPriceList(container, priceListId)

      variants.forEach((pv) => variantIdsFilter.add(pv.id))
    } else {
      // TODO: it is working but validate the behaviour.
      // e.g pricing context properly set.
      // At the moment filtering by price list but not having any customer id or
      // include discount forces the query to filter with price list id is null
      const priceListService = container.resolve(
        "priceListService"
      ) as PriceListService

      promises.push(
        priceListService
          .listPriceListsVariantIdsMap(priceListId)
          .then((priceListVariantIdsMap) => {
            priceListVariantIdsMap[priceListId].map((variantId) =>
              variantIdsFilter.add(variantId)
            )
          })
      )
    }
  }

  const discountConditionId = filterableFields.discount_condition_id
  delete filterableFields.discount_condition_id

  if (discountConditionId) {
    // TODO implement later
  }

  await promiseAll(promises)

  if (productIdsFilter.size > 0) {
    filterableFields.id = Array.from(productIdsFilter)
  }

  if (variantIdsFilter.size > 0) {
    filterableFields.variants = { id: Array.from(variantIdsFilter) }
  }

  const variables = {
    filters: filterableFields,
    order: listConfig.order,
    skip: listConfig.skip,
    take: listConfig.take,
  }

  const query = {
    product: {
      __args: variables,
      ...defaultAdminProductRemoteQueryObject,
    },
  }

  if (salesChannelIdFilter) {
    query.product["sales_channels"]["__args"] = { id: salesChannelIdFilter }
  }

  const {
    rows: products,
    metadata: { count },
  } = await remoteQuery(query)

  products.forEach((product) => {
    product.profile_id = product.profile?.id
  })

  return [products, count]
}

export const defaultAdminProductRemoteQueryObject = {
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

  categories: {
    fields: [
      "id",
      "name",
      "description",
      "handle",
      "is_active",
      "is_internal",
      "parent_category_id",
    ],
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
  sales_channels: {
    fields: [
      "id",
      "name",
      "description",
      "is_disabled",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
    ],
  },
}
