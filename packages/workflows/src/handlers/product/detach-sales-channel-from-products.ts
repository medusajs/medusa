import { ProductTypes } from "@medusajs/types"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

type ProductHandle = string
type SalesChannelId = string

export const DetachSalesChannelToProductsInputAlias =
  "detachSalesChannelToProducts"

export async function detachSalesChannelFromProducts<T = void>({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: {
    [DetachSalesChannelToProductsInputAlias]: {
      productsHandleSalesChannelsMap: Map<ProductHandle, SalesChannelId[]>
      products: ProductTypes.ProductDTO[]
    }
  }
}): Promise<PipelineHandlerResult<T>> {
  const { manager } = context
  data = data[DetachSalesChannelToProductsInputAlias]

  const salesChannelService = container.resolve("salesChannelService")
  const salesChannelServiceTx = salesChannelService.withTransaction(manager)

  const salesChannelIdProductIdsMap = new Map<ProductHandle, SalesChannelId[]>()
  data.products.forEach((product) => {
    const salesChannelIds = data.productsHandleSalesChannelsMap.get(
      product.handle!
    )
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

  return void 0 as unknown as PipelineHandlerResult<T>
}
