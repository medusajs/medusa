import { transformProduct } from "../utils/transform-products"

const INDEX_NS = "medusa-commerce"

async function loadIntoSearchEngine(container) {
  const meilisearchService = container.resolve("meilisearchService")
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

    const transformedProducts = products.map(transformProduct)

    await meilisearchService.addDocuments(
      `medusa-commerce_products`,
      transformedProducts
    )

    iterCount += products.length
    lastSeenId = products.at(-1).id
  }
}

export default async (container, options) => {
  try {
    const meilisearchService = container.resolve("meilisearchService")

    await Promise.all(
      Object.entries(options.settings).map(([key, value]) =>
        meilisearchService.updateSettings(`${INDEX_NS}_${key}`, value)
      )
    )

    await loadIntoSearchEngine(container)
  } catch (err) {
    console.log(err)
  }
}
