import {
  deleteRegionsWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/core-flows"
import { UpdateRegionDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultAdminRegionFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result, errors } = await updateRegionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as UpdateRegionDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ region: result[0] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
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
