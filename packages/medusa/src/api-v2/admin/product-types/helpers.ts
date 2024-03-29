import { MedusaContainer } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const refetchProductType = async (
  productTypeId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve("remoteQuery")
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_type",
    variables: {
      filters: { id: productTypeId },
    },
    fields: fields,
  })

  const productTypes = await remoteQuery(queryObject)
  return productTypes[0]
}
