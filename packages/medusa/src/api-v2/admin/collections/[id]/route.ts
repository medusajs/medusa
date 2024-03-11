import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteCollectionsWorkflow,
  updateCollectionsWorkflow,
} from "@medusajs/core-flows"

import { UpdateProductCollectionDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_collection",
    variables,
    fields: req.retrieveConfig.select as string[],
  })

  const [collection] = await remoteQuery(queryObject)

  res.status(200).json({ collection })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateProductCollectionDTO>,
  res: MedusaResponse
) => {
  const { result, errors } = await updateCollectionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ collection: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { errors } = await deleteCollectionsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "collection",
    deleted: true,
  })
}
