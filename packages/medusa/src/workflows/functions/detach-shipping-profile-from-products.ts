import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ShippingProfileService } from "../../services"

export async function detachShippingProfileFromProducts({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    productsHandleShippingProfileMap: Map<string, string>
    products: ProductTypes.ProductDTO[]
  }
}): Promise<void> {
  const shippingProfileService: ShippingProfileService = container.resolve(
    "shippingProfileService"
  )
  const shippingProfileServiceTx =
    shippingProfileService.withTransaction(manager)

  const profileIdProductIdsMap = new Map<string, string[]>()
  data.products.forEach((product) => {
    const profileId = data.productsHandleShippingProfileMap.get(product.handle!)
    if (profileId) {
      const productIds = profileIdProductIdsMap.get(profileId) || []
      productIds.push(product.id)
      profileIdProductIdsMap.set(profileId, productIds)
    }
  })

  await Promise.all(
    Array.from(profileIdProductIdsMap.entries()).map(
      async ([profileId, productIds]) => {
        return await shippingProfileServiceTx.removeProducts(
          profileId,
          productIds
        )
      }
    )
  )
}
