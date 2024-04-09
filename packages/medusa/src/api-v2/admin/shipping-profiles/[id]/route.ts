import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AdminShippingProfileResponse,
  IFulfillmentModuleService,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
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

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "shipping_profiles",
    variables: { id: req.params.id },
    fields: req.remoteQueryConfig.fields,
  })

  const [shippingProfile] = await remoteQuery(query)

  res.status(200).json({ shipping_profile: shippingProfile })
}
