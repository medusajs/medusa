import { deleteShippingProfileWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { HttpTypes, IFulfillmentModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchShippingProfile } from "../helpers"
import { AdminGetShippingProfileParamsType } from "../validators"

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
