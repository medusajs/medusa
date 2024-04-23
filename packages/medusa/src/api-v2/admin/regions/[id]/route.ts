import {
  deleteRegionsWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/core-flows"
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
  res.status(200).json({ region })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateRegionType>,
  res: MedusaResponse
) => {
  const { result, errors } = await updateRegionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

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

  const { errors } = await deleteRegionsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "region",
    deleted: true,
  })
}
