import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type SalesChannelId = string
type PartialProduct = { handle: string; id: string }
type HandlerInput = {
  productsHandleSalesChannelsMap: Map<ProductHandle, SalesChannelId[]>
  products: PartialProduct[]
}

export async function detachSalesChannelFromProducts({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
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
        return await salesChannelServiceTx.removeProducts(
          salesChannelId,
          productIds
        )
      }
    )
  )
}

detachSalesChannelFromProducts.aliases = {
  products: "products",
}
