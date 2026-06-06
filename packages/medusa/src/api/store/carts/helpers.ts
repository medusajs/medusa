import { MedusaContainer } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"

export const refetchCart = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "cart",
    variables: { filters: { id } },
    fields,
  })

  const [cart] = await remoteQuery(queryObject)

  if (!cart) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Cart with id '${id}' not found`
    )
  }

  return cart
}
