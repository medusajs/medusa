import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteRegionsWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/core-flows"

import { UpdatableRegionFields } from "@medusajs/types"
import { defaultAdminRegionFields } from "../query-config"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "region",
    variables,
    fields: defaultAdminRegionFields,
  })

  const [region] = await remoteQuery(queryObject)

  res.status(200).json({ region })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdatableRegionFields>,
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

  res.status(200).json({ region: result[0] })
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
