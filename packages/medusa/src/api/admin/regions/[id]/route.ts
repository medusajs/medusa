import {
  deleteRegionsWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchRegion } from "../helpers"
import { AdminGetRegionParamsType, AdminUpdateRegionType } from "../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetRegionParamsType>,
  res: MedusaResponse<HttpTypes.AdminRegionResponse>
) => {
  const region = await refetchRegion(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Region with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ region })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateRegionType>,
  res: MedusaResponse<HttpTypes.AdminRegionResponse>
) => {
  const existingRegion = await refetchRegion(req.params.id, req.scope, ["id"])
  if (!existingRegion) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Region with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateRegionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const region = await refetchRegion(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ region })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminRegionDeleteResponse>
) => {
  const id = req.params.id

  await deleteRegionsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "region",
    deleted: true,
  })
}
