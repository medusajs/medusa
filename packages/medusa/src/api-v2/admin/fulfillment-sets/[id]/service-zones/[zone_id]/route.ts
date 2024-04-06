import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { deleteTaxRegionsWorkflow } from "../../../../../../../../core-flows/dist"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id, zone_id } = req.params

  const fulfillmentModuleService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  const fulfillmentSet = await fulfillmentModuleService.retrieve(id)

  const { errors } = await deleteTaxRegionsWorkflow(req.scope).run({
    input: { ids: [zone_id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id: zone_id,
    object: "service-zone",
    deleted: true,
    parent: fulfillmentSet,
  })
}
