import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchApiKey = async (
  apiKeyId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api_key",
    variables: {
      filters: { id: apiKeyId },
    },
    fields: fields,
  })

  const apiKeys = await remoteQuery(queryObject)
  return apiKeys[0]
}
