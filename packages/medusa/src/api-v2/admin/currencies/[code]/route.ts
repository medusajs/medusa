import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { code: req.params.code }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "currency",
    variables,
    fields: req.remoteQueryConfig.fields,
  })

  const [currency] = await remoteQuery(queryObject)
  if (!currency) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Currency with code: ${req.params.code} was not found`
    )
  }

  res.status(200).json({ currency })
}
