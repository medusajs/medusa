import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AdminShippingProfileResponse,
  IFulfillmentModuleService,
} from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminShippingProfileResponse>
) => {
  const fulfillmentService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  const shippingProfile = await fulfillmentService.retrieveShippingProfile(
    req.params.id
  )

  res.status(200).json({ shipping_profile: shippingProfile })
}
