import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type SalesChannelId = string

export async function attachSalesChannelToProducts({
  container,
  context,
  data,
}: WorkflowArguments<{
  productsHandleSalesChannelsMap: Map<ProductHandle, SalesChannelId[]>
  products: ProductTypes.ProductDTO[]
}>): Promise<void> {
  const { manager } = context
  const productsHandleSalesChannelsMap = data.productsHandleSalesChannelsMap
  const products = data.products

  const salesChannelService = container.resolve("salesChannelService")
  const salesChannelServiceTx = salesChannelService.withTransaction(manager)

  const salesChannelIdProductIdsMap = new Map<ProductHandle, SalesChannelId[]>()
  products.forEach((product) => {
    const salesChannelIds = productsHandleSalesChannelsMap.get(product.handle!)
    if (salesChannelIds) {
      salesChannelIds.forEach((salesChannelId) => {
        const productIds = salesChannelIdProductIdsMap.get(salesChannelId) || []
        productIds.push(product.id)
        salesChannelIdProductIdsMap.set(salesChannelId, productIds)
      })
    }
  })

  await Promise.all(
    Array.from(salesChannelIdProductIdsMap.entries()).map(
      async ([salesChannelId, productIds]) => {
        return await salesChannelServiceTx.addProducts(
          salesChannelId,
          productIds
        )
      }
    )
  )
}

attachSalesChannelToProducts.aliases = {
  products: "products",
}
