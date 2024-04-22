import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchCategory = async (
  categoryId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_category",
    variables: {
      filters: { id: categoryId },
    },
    fields: fields,
  })

  const categorys = await remoteQuery(queryObject)
  return categorys[0]
}
