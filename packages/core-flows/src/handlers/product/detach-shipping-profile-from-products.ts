import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { promiseAll } from "@medusajs/utils"

type ProductHandle = string
type ShippingProfileId = string
type PartialProduct = { handle: string; id: string }
type HandlerInput = {
  productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>
  products: PartialProduct[]
}

export async function detachShippingProfileFromProducts({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const { manager } = context
  const productsHandleShippingProfileIdMap =
    data.productsHandleShippingProfileIdMap
  const products = data.products

  const shippingProfileService = container.resolve("shippingProfileService")
  const shippingProfileServiceTx =
    shippingProfileService.withTransaction(manager)

  const profileIdProductIdsMap = new Map<ShippingProfileId, ProductHandle[]>()
  products.forEach((product) => {
    const profileId = productsHandleShippingProfileIdMap.get(product.handle!)
    if (profileId) {
      const productIds = profileIdProductIdsMap.get(profileId) || []
      productIds.push(product.id)
      profileIdProductIdsMap.set(profileId, productIds)
    }
  })

  await promiseAll(
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

detachShippingProfileFromProducts.aliases = {
  products: "products",
}
