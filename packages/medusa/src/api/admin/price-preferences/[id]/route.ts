import {
  deletePricePreferencesWorkflow,
  updatePricePreferencesWorkflow,
} from "@medusajs/core-flows"

import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminPricePreferenceResponse>
) => {
  const price_preference = await refetchEntity(
    "price_preference",
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ price_preference })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUpdatePricePreference>,
  res: MedusaResponse<HttpTypes.AdminPricePreferenceResponse>
) => {
  const id = req.params.id
  const workflow = updatePricePreferencesWorkflow(req.scope)

  await workflow.run({
    input: { selector: { id: [id] }, update: req.body },
  })

  const price_preference = await refetchEntity(
    "price_preference",
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ price_preference })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminPricePreferenceDeleteResponse>
) => {
  const id = req.params.id
  const workflow = deletePricePreferencesWorkflow(req.scope)

  await workflow.run({
    input: [id],
  })

  res.status(200).json({
    id,
    object: "price_preference",
    deleted: true,
  })
}
