import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import {
  deleteStockLocationsWorkflow,
  updateStockLocationsWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { refetchStockLocation } from "../helpers"
import {
  AdminGetStockLocationParamsType,
  AdminUpdateStockLocationType,
} from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateStockLocationType>,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { id } = req.params
  await updateStockLocationsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const stockLocation = await refetchStockLocation(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    stock_location: stockLocation,
  })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetStockLocationParamsType>,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { id } = req.params

  const stockLocation = await refetchStockLocation(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!stockLocation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Stock location with id: ${id} was not found`
    )
  }

  res.status(200).json({ stock_location: stockLocation })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminStockLocationDeleteResponse>
) => {
  const { id } = req.params

  await deleteStockLocationsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "stock_location",
    deleted: true,
  })
}
