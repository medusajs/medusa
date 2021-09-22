import ProductService from "../services/product"

async function loadProductsIntoSearchEngine(container) {
  const searchService = container.resolve("searchService")
  const productService = container.resolve("productService")

  const TAKE = 20
  const totalCount = await productService.count()
  let iterCount = 0,
    lastSeenId = "prod"

  while (iterCount < totalCount) {
    const products = await productService.list(
      { id: { gt: lastSeenId } },
      {
        select: [
          "id",
          "title",
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
        relations: ["variants", "tags", "type", "collection"],
        take: TAKE,
        order: { id: "ASC" },
      }
    )

    const transformedBatch = searchService.transformProducts(products)

    await searchService.addDocuments(ProductService.IndexName, transformedBatch)

    iterCount += products.length
    lastSeenId = products[products.length - 1].id
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
