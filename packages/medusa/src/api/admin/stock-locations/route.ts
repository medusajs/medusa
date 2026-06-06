import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import { createStockLocationsWorkflow } from "@zjedene-medusa/core-flows"
import { refetchStockLocation } from "./helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

// Create stock location
export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateStockLocation,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { result } = await createStockLocationsWorkflow(req.scope).run({
    input: { locations: [req.validatedBody] },
  })

  const stockLocation = await refetchStockLocation(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminStockLocationListParams>,
  res: MedusaResponse<HttpTypes.AdminStockLocationListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { rows: stock_locations, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        filters: req.filterableFields,
        ...req.queryConfig.pagination,
      },
      fields: req.queryConfig.fields,
    })
  )

  res.status(200).json({
    stock_locations,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
