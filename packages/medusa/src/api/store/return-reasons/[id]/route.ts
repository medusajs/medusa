import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { StoreReturnReasonParamsType } from "../validators"

export const GET = async (
  req: MedusaRequest<StoreReturnReasonParamsType>,
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
