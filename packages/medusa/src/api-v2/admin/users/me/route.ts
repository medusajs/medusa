import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.auth.app_metadata.user_id
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  if (!id) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `User ID not found`)
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: { id },
    fields: req.remoteQueryConfig.fields,
  })

  const [user] = await remoteQuery(query)

  if (!user) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `User with id: ${id} was not found`
    )
  }

  res.status(200).json({ user })
}
