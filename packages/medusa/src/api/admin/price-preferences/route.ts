import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
  refetchEntity,
} from "@medusajs/framework/http"
import { createPricePreferencesWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminPricePreferenceListParams>,
  res: MedusaResponse<HttpTypes.AdminPricePreferenceListResponse>
) => {
  const { rows: price_preferences, metadata } = await refetchEntities(
    "price_preference",
    req.filterableFields,
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )
  res.json({
    price_preferences: price_preferences,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreatePricePreference>,
  res: MedusaResponse<HttpTypes.AdminPricePreferenceResponse>
) => {
  const workflow = createPricePreferencesWorkflow(req.scope)
  const { result } = await workflow.run({
    input: [req.validatedBody],
  })

  const price_preference = await refetchEntity(
    "price_preference",
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ price_preference })
}
