import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { SalesChannelService } from "../../services"

type ProductHandle = string
type SalesChannelId = string

export async function detachSalesChannelFromProducts({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    productsHandleSalesChannelsMap: Map<ProductHandle, SalesChannelId[]>
    products: ProductTypes.ProductDTO[]
  }
}): Promise<void> {
  const salesChannelService: SalesChannelService = container.resolve(
    "salesChannelService"
  )
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
}
