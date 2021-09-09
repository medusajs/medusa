import {
  defaultProductFields,
  defaultProductRelations,
  flattenSkus,
} from "../utils"

export default async (container, options) => {
  try {
    const meilisearchService = container.resolve("meilisearchService")
    const productService = container.resolve("productService")

    const products = await productService.list(
      {},
      {
        select: defaultProductFields,
        relations: defaultProductRelations,
      }
    )
    const productsWithSkus = products.map((product) => flattenSkus(product))

    await meilisearchService.updateSettings()
    await meilisearchService.addDocuments(productsWithSkus)
  } catch (err) {
    console.log(err)
  }
}
