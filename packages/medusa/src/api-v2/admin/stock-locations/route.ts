import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"

import { createStockLocationsWorkflow } from "@medusajs/core-flows"
import {
  AdminCreateStockLocationType,
  AdminGetStockLocationsParamsType,
} from "./validators"
import { refetchStockLocation } from "./helpers"

// Create stock location
export const POST = async (
  req: MedusaRequest<AdminCreateStockLocationType>,
  res: MedusaResponse
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
  req: MedusaRequest<AdminGetStockLocationsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { rows: stock_locations, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        filters: req.filterableFields,
        ...req.remoteQueryConfig.pagination,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({
    stock_locations,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
