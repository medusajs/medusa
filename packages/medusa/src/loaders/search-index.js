import ProductService from "../services/product"
import { indexTypes } from "medusa-core-utils"

async function loadProductsIntoSearchEngine(container) {
  const searchService = container.resolve("searchService")
  const productService = container.resolve("productService")

  const TAKE = 20
  let hasMore = true

  let lastSeenId = ""

  while (hasMore) {
    const products = await productService.list(
      { id: { gt: lastSeenId } },
      {
        select: [
          "id",
          "title",
          "status",
          "subtitle",
          "description",
          "handle",
          "is_giftcard",
          "discountable",
          "thumbnail",
          "profile_id",
          "collection_id",
          "type_id",
          "origin_country",
          "created_at",
          "updated_at",
        ],
        relations: [
          "variants",
          "tags",
          "type",
          "collection",
          "variants.prices",
          "variants.options",
          "options",
        ],
        take: TAKE,
        order: { id: "ASC" },
      }
    )

    if (products.length > 0) {
      await searchService.addDocuments(
        ProductService.IndexName,
        products,
        indexTypes.products
      )
      lastSeenId = products[products.length - 1].id
    } else {
      hasMore = false
    }
  }
}

export default async ({ container }) => {
  const searchService = container.resolve("searchService")
  const logger = container.resolve("logger")
  if (searchService.isDefault) {
    logger.warn(
      "No search engine provider was found: make sure to include a search plugin to enable searching"
    )
    return
  }

  await loadProductsIntoSearchEngine(container)
}
