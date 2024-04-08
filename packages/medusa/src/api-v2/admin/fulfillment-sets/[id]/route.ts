import {
  AdminFulfillmentSetsDeleteResponse,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaError } from "@medusajs/utils"
import { deleteFulfillmentSetsWorkflow } from "@medusajs/core-flows"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminFulfillmentSetsDeleteResponse>
) => {
  const { id } = req.params

  const fulfillmentModuleService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  const fulfillmentSet = await fulfillmentModuleService.retrieve(id)

  if (!fulfillmentSet) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Fulfillment set with id: ${id} not found`
    )
  }

  const { errors } = await deleteFulfillmentSetsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "fulfillment-set",
    deleted: true,
  })
}
