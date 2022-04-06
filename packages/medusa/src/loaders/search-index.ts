import ProductService from "../services/product"
import { indexTypes } from "medusa-core-utils"
import { MedusaContainer } from "../types/global"
import DefaultSearchService from "../services/search"
import { Logger } from "../types/global"

async function loadProductsIntoSearchEngine(container: MedusaContainer): Promise<void> {
  const searchService = container.resolve<DefaultSearchService>("searchService")
  const productService = container.resolve<ProductService>("productService")

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

export default async ({ container }: { container: MedusaContainer }): Promise<void> => {
  const searchService = container.resolve<DefaultSearchService>("searchService")
  const logger = container.resolve<Logger>("logger")
  if (searchService.isDefault) {
    logger.warn(
      "No search engine provider was found: make sure to include a search plugin to enable searching"
    )
    return
  }

  await loadProductsIntoSearchEngine(container)
}
