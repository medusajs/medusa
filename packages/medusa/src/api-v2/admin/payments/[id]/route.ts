import { Modules } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
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
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id } = req.params

  const query = remoteQueryObjectFromString({
    entryPoint: Modules.PAYMENT,
    variables: { id },
    fields: req.retrieveConfig.select as string[],
  })

  const [payment] = await remoteQuery(query)

  res.status(200).json({ payment })
}
