import { createShippingProfilesWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AdminShippingProfileResponse,
  AdminShippingProfilesResponse,
  IFulfillmentModuleService,
} from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminCreateShippingProfileType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateShippingProfileType>,
  res: MedusaResponse<AdminShippingProfileResponse>
) => {
  const shippingProfilePayload = req.validatedBody

  const { result, errors } = await createShippingProfilesWorkflow(
    req.scope
  ).run({
    input: { data: [shippingProfilePayload] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const shippingProfileId = result?.[0].id

  const fulfillmentService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  const shippingProfile = await fulfillmentService.retrieveShippingProfile(
    shippingProfileId
  )

  res.status(200).json({ shipping_profile: shippingProfile })
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminShippingProfilesResponse>
) => {
  const fulfillmentService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  const [shippingProfiles, count] =
    await fulfillmentService.listAndCountShippingProfiles(
      req.filterableFields,
      req.listConfig
    )

  const { offset, limit } = req.validatedQuery

  res.status(200).json({
    shipping_profiles: shippingProfiles,
    count,
    offset: offset!,
    limit: limit!,
  })
}
