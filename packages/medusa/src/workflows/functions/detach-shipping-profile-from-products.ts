import { MedusaContainer, ProductTypes } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ShippingProfileService } from "../../services"

type ProductHandle = string
type ShippingProfileId = string

export async function detachShippingProfileFromProducts({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>
    products: ProductTypes.ProductDTO[]
  }
}): Promise<void> {
  const shippingProfileService: ShippingProfileService = container.resolve(
    "shippingProfileService"
  )
  const shippingProfileServiceTx =
    shippingProfileService.withTransaction(manager)

  const profileIdProductIdsMap = new Map<ShippingProfileId, ProductHandle[]>()
  data.products.forEach((product) => {
    const profileId = data.productsHandleShippingProfileIdMap.get(
      product.handle!
    )
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
