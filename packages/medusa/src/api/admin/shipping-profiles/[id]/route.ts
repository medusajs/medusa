import {
  deleteShippingProfileWorkflow,
  updateShippingProfilesWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes, IFulfillmentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchShippingProfile } from "../helpers"
import {
  AdminGetShippingProfileParamsType,
  AdminUpdateShippingProfileType,
} from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetShippingProfileParamsType>,
  res: MedusaResponse<HttpTypes.AdminShippingProfileResponse>
) => {
  const shippingProfile = await refetchShippingProfile(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ shipping_profile: shippingProfile })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminShippingProfileDeleteResponse>
) => {
  const { id } = req.params

  const fulfillmentModuleService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  // Test if exists
  await fulfillmentModuleService.retrieveShippingProfile(id)

  await deleteShippingProfileWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "shipping_profile",
    deleted: true,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateShippingProfileType>,
  res: MedusaResponse<HttpTypes.AdminShippingProfileResponse>
) => {
  const { id } = req.params

  await updateShippingProfilesWorkflow(req.scope).run({
    input: { selector: { id }, update: req.body },
  })

  const shippingProfile = await refetchShippingProfile(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    shipping_profile: shippingProfile,
  })
}
