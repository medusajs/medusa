import { ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type SalesChannelId = string

export const DetachSalesChannelToProductsInputAlias =
  "detachSalesChannelToProducts"

export async function detachSalesChannelFromProducts({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: {
    detachSalesChannelToProductsInputData: {
      productsHandleSalesChannelsMap: Map<ProductHandle, SalesChannelId[]>
    }
    detachSalesChannelToProductsProducts: ProductTypes.ProductDTO[]
  }
}): Promise<void> {
  const { manager } = context
  const productsHandleSalesChannelsMap =
    data.detachSalesChannelToProductsInputData.productsHandleSalesChannelsMap
  const products = data.detachSalesChannelToProductsProducts

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
        return await salesChannelServiceTx.removeProducts(
          salesChannelId,
          productIds
        )
      }
    )
  )
}

detachSalesChannelFromProducts.aliases = {
  detachSalesChannelToProductsInputData:
    "detachSalesChannelToProductsInputData",
  detachSalesChannelToProductsProducts: "detachSalesChannelToProductsProducts",
}
