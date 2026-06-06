import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: MedusaRequest<HttpTypes.StoreReturnReasonParams>,
  res: MedusaResponse<HttpTypes.StoreReturnReasonResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return_reason",
    variables,
    fields: req.queryConfig.fields,
  })

  const [return_reason] = await remoteQuery(queryObject)

  res.json({ return_reason })
}
