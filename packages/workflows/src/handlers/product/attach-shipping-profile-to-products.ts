import { ProductTypes } from "@medusajs/types"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

type ProductHandle = string
type ShippingProfileId = string

export const AttachShippingProfileToProductsInputAlias =
  "attachShippingProfileToProductsInputData"

export async function attachShippingProfileToProducts<T = void>({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: {
    [AttachShippingProfileToProductsInputAlias]: {
      productsHandleShippingProfileIdMap: Map<ProductHandle, ShippingProfileId>
      products: ProductTypes.ProductDTO[]
    }
  }
}): Promise<PipelineHandlerResult<T>> {
  const { manager } = context
  data = data[AttachShippingProfileToProductsInputAlias]

  const shippingProfileService = container.resolve("shippingProfileService")
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
        return await shippingProfileServiceTx.addProducts(profileId, productIds)
      }
    )
  )

  return void 0 as unknown as PipelineHandlerResult<T>
}
