import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { promiseAll } from "@medusajs/utils"

type ProductHandle = string
type ShippingProfileId = string
type PartialProduct = { handle: string; id: string }
type handlerInput = {
  productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>
  products: PartialProduct[]
}

export async function attachShippingProfileToProducts({
  container,
  context,
  data,
}: WorkflowArguments<handlerInput>): Promise<void> {
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
        return await shippingProfileServiceTx.addProducts(profileId, productIds)
      }
    )
  )
}

attachShippingProfileToProducts.aliases = {
  products: "products",
}
