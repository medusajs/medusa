import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteCollectionsWorkflow,
  updateCollectionsWorkflow,
} from "@medusajs/core-flows"

import { AdminUpdateCollectionType } from "../validators"
import { refetchCollection } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const collection = await refetchCollection(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ collection })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateCollectionType>,
  res: MedusaResponse
) => {
  await updateCollectionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const collection = await refetchCollection(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ collection })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  await deleteCollectionsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "collection",
    deleted: true,
  })
}
