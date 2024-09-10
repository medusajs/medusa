import { createShippingProfilesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchShippingProfile } from "./helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateShippingProfile>,
  res: MedusaResponse<HttpTypes.AdminShippingProfileResponse>
) => {
  const shippingProfilePayload = req.validatedBody

  const { result } = await createShippingProfilesWorkflow(req.scope).run({
    input: { data: [shippingProfilePayload] },
  })

  const shippingProfile = await refetchShippingProfile(
    result?.[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ shipping_profile: shippingProfile })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminShippingProfileListParams>,
  res: MedusaResponse<HttpTypes.AdminShippingProfileListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: shippingProfiles, metadata } = await query.graph({
    entryPoint: "shipping_profiles",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({
    shipping_profiles: shippingProfiles,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}
