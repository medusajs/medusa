import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchInvite = async (
  inviteId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "invite",
    variables: {
      filters: { id: inviteId },
    },
    fields: fields,
  })

  const invites = await remoteQuery(queryObject)
  return invites[0]
}
