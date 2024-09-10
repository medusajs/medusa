import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { createStockLocationsWorkflow } from "@medusajs/core-flows"
import { refetchStockLocation } from "./helpers"
import { HttpTypes } from "@medusajs/types"

// Create stock location
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateStockLocation>,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { result } = await createStockLocationsWorkflow(req.scope).run({
    input: { locations: [req.validatedBody] },
  })

  const stockLocation = await refetchStockLocation(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminStockLocationListParams>,
  res: MedusaResponse<HttpTypes.AdminStockLocationListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: stock_locations, metadata } = await query.graph({
    entryPoint: "stock_locations",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({
    stock_locations,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}
