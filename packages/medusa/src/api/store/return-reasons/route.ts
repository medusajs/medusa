import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreReturnReasonListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return_reason",
    variables: {
      filters: {
        ...req.filterableFields,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: return_reasons, metadata } = await remoteQuery(queryObject)

  res.json({
    return_reasons,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
