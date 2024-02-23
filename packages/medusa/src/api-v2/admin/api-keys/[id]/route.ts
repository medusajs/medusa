import {
  deleteApiKeysWorkflow,
  updateApiKeysWorkflow,
} from "@medusajs/core-flows"
import { UpdateApiKeyDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultAdminApiKeyFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api-key",
    variables,
    fields: defaultAdminApiKeyFields,
  })

  const [apiKey] = await remoteQuery(queryObject)

  res.status(200).json({ apiKey })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result, errors } = await updateApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as Omit<UpdateApiKeyDTO, "id">,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ apiKey: result[0] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id

  const { errors } = await deleteApiKeysWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "api-key",
    deleted: true,
  })
}
