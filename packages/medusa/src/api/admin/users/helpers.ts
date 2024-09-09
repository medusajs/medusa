import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"

export const refetchUser = async (
  userId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [user],
  } = await query.graph({
    entryPoint: "user",
    variables: {
      filters: { id: userId },
    },
    fields: fields,
  })

  return user
}
