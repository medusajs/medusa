import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreRegionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables: {
      filters: { id: req.params.id },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [region] = await remoteQuery(queryObject)

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Region with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ region })
}
