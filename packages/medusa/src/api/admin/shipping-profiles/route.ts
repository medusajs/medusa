import { createShippingProfilesWorkflow } from "@medusajs/core-flows"
import {
  AdminShippingProfileResponse,
  AdminShippingProfilesResponse,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  AdminCreateShippingProfileType,
  AdminGetShippingProfilesParamsType,
} from "./validators"
import { refetchShippingProfile } from "./helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateShippingProfileType>,
  res: MedusaResponse<AdminShippingProfileResponse>
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
  req: AuthenticatedMedusaRequest<AdminGetShippingProfilesParamsType>,
  res: MedusaResponse<AdminShippingProfilesResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "shipping_profiles",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: shippingProfiles, metadata } = await remoteQuery(query)

  res.status(200).json({
    shipping_profiles: shippingProfiles,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
