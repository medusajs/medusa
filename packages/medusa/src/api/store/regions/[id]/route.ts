import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: MedusaRequest<HttpTypes.StoreGetRegionParams>,
  res: MedusaResponse<HttpTypes.StoreRegionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables: {
      filters: { id: req.params.id },
    },
    fields: req.queryConfig.fields,
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
