import {
  deleteRegionsWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/core-flows"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchRegion } from "../helpers"
import { AdminGetRegionParamsType, AdminUpdateRegionType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetRegionParamsType>,
  res: MedusaResponse
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
  res: MedusaResponse
) => {
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
  res: MedusaResponse
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
