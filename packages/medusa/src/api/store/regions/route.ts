import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest<HttpTypes.StoreRegionFilters>,
  res: MedusaResponse<HttpTypes.StoreRegionListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: regions, metadata } = await remoteQuery(queryObject)

  res.json({
    regions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
